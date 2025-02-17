"use server";

import createSupabaseServerClient from "@/supabase-query/server";
import { BlogType, LogActorType, StaffRole } from "@utils/types";
import { saveToLog } from "@app/_actions/log";
import { checkRoleStaff } from "@app/_actions/user";
import { revalidatePath } from "next/cache";
import { buildResponse } from "@/utils/functions/buildResponse";
import { Log } from "@/utils/types/log";
import { ApiStatus, ApiStatusNumber } from "@/utils/types/apiStatus";
import {
  NO_PERMISSION_TO_CREATE,
  NO_PERMISSION_TO_DELETE,
  NO_PERMISSION_TO_UPDATE,
} from "@/utils/constant/auth";

export async function createBlog({ blog }: { blog: BlogType }) {
  try {
    const isManagerAuthenticated = await checkRoleStaff({
      role: StaffRole.Manager,
    });
    const isSellerAuthenticated = await checkRoleStaff({
      role: StaffRole.Writer,
    });

    if (!isManagerAuthenticated && !isSellerAuthenticated)
      throw new Error(NO_PERMISSION_TO_CREATE);

    const supabase = await createSupabaseServerClient();

    const result = await supabase.from("blog").insert(blog);

    revalidatePath("/dashboard/blog");

    return buildResponse({
      status: result.status,
      statusText: result.statusText,
      data: result.data,
      error: result.error,
    });
  } catch (error: any) {
    return buildResponse({
      status: ApiStatusNumber.InternalServerError,
      statusText: ApiStatus.InternalServerError,
      data: null,
      error: error,
    });
  }
}

export async function readBlogs({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  try {
    const supabase = await createSupabaseServerClient();

    const result = await supabase
      .from("blog")
      .select("*")
      .range(offset, limit)
      .eq("is_deleted", false);

    return buildResponse({
      status: result.status,
      statusText: result.statusText,
      data: result.data as BlogType[],
      error: result.error,
    });
  } catch (error: any) {
    return buildResponse({
      status: ApiStatusNumber.InternalServerError,
      statusText: ApiStatus.InternalServerError,
      data: null,
      error: error,
    });
  }
}

export async function readBlogById(id: string) {
  try {
    const supabase = await createSupabaseServerClient();

    const result = await supabase
      .from("blog")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    return buildResponse({
      status: result.status,
      statusText: result.statusText,
      data: result.data as BlogType,
      error: result.error,
    });
  } catch (error: any) {
    return buildResponse({
      status: ApiStatusNumber.InternalServerError,
      statusText: ApiStatus.InternalServerError,
      data: null,
      error: error,
    });
  }
}

export async function deleteBlogById({
  blog,
  actor,
}: {
  blog: BlogType;
  actor: LogActorType;
}) {
  try {
    const isManagerAuthenticated = await checkRoleStaff({
      role: StaffRole.Manager,
    });
    const isSellerAuthenticated = await checkRoleStaff({
      role: StaffRole.Writer,
    });

    if (!isManagerAuthenticated && !isSellerAuthenticated)
      throw new Error(NO_PERMISSION_TO_DELETE);

    const supabase = await createSupabaseServerClient();

    const result = await supabase
      .from("blog")
      .update({ is_deleted: true })
      .eq("id", blog.id);

    await saveToLog({
      logName: "Xóa bài viết " + blog.title,
      logType: Log.Delete,
      logResult: !result.error ? Log.Success : Log.Fail,
      logActor: actor,
    });

    return buildResponse({
      status: result.status,
      statusText: result.statusText,
      data: result.data,
      error: result.error,
    });
  } catch (error: any) {
    return buildResponse({
      status: ApiStatusNumber.InternalServerError,
      statusText: ApiStatus.InternalServerError,
      data: null,
      error: error,
    });
  }
}

export async function updateBlog({
  updatedBlog,
  actor,
}: {
  updatedBlog: BlogType;
  actor: LogActorType;
}) {
  try {
    const isManagerAuthenticated = await checkRoleStaff({
      role: StaffRole.Manager,
    });
    const isWriterAuthenticated = await checkRoleStaff({
      role: StaffRole.Writer,
    });

    if (!isManagerAuthenticated && !isWriterAuthenticated)
      throw new Error(NO_PERMISSION_TO_UPDATE);

    const supabase = await createSupabaseServerClient();

    const result = await supabase
      .from("blog")
      .update(updatedBlog)
      .eq("id", updatedBlog.id)
      .eq("is_deleted", false);

    await saveToLog({
      logName: "Cập nhật bài viết " + updatedBlog.title,
      logType: Log.Update,
      logResult: !result.error ? Log.Success : Log.Fail,
      logActor: actor,
    });

    return buildResponse({
      status: result.status,
      statusText: result.statusText,
      data: result.data,
      error: result.error,
    });
  } catch (error: any) {
    return buildResponse({
      status: ApiStatusNumber.InternalServerError,
      statusText: ApiStatus.InternalServerError,
      data: null,
      error: error,
    });
  }
}
