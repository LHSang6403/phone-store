import { readStaffs } from "@app/_actions/user";
import { StaffType } from "@/utils/types";
import { DataTable } from "@components/Table/DataTable";
import { columns } from "./Components/Columns";

export default async function page() {
  const staffs = await readStaffs({ limit: 20, offset: 0 });

  return (
    <section className="">
      <h1 className="my-2 text-2xl font-medium">All staff</h1>
      {staffs.data && (
        <DataTable
          columns={columns}
          data={staffs.data as StaffType[]}
          isPaginationEnabled={true}
        />
      )}
    </section>
  );
}
