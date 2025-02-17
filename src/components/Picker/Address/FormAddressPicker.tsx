"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import useAddressSelects from "@/zustand/useAddressSelects";
import province from "@/static-data/provinces.json";
import district from "@/static-data/districts.json";
import communes from "@/static-data/communes.json";
import { useMemo } from "react";

export default function FormAddressPicker() {
  const { addressValues, setProvince, setDistrict, setCommune } =
    useAddressSelects();

  const districtsInProvince = useMemo(
    () => district.filter((dis) => dis.idProvince === addressValues.provinceId),
    [addressValues.provinceId]
  );

  const communesInDistrict = useMemo(
    () => communes.filter((com) => com.idDistrict === addressValues.districtId),
    [addressValues.districtId]
  );

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Select
        key="province-all"
        onValueChange={(value) => {
          const parsedValue = JSON.parse(value);
          setProvince(parsedValue.name, parsedValue.id);
          setDistrict("", "");
          setCommune("", "");
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={addressValues.province || "Chọn tỉnh"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tỉnh, thành</SelectLabel>
            {province.map((pro, index) => (
              <SelectItem
                key={index}
                value={JSON.stringify({ name: pro.name, id: pro.idProvince })}
              >
                {pro.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        key={
          addressValues.provinceId !== ""
            ? addressValues.provinceId
            : "district"
        }
        disabled={addressValues.provinceId === ""}
        onValueChange={(value) => {
          const parsedValue = JSON.parse(value);
          setDistrict(parsedValue.name, parsedValue.id);
          setCommune("", "");
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={addressValues.district || "Chọn quận, huyện"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Quận, huyện</SelectLabel>
            {districtsInProvince.map((dis, index) => (
              <SelectItem
                key={index}
                value={JSON.stringify({ name: dis.name, id: dis.idDistrict })}
              >
                {dis.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        key={
          addressValues.districtId !== "" ? addressValues.districtId : "commune"
        }
        disabled={addressValues.districtId === ""}
        onValueChange={(value) => {
          const parsedValue = JSON.parse(value);
          setCommune(parsedValue.name, parsedValue.id);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={addressValues.commune || "Chọn phường, xã"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Phường, xã</SelectLabel>
            {communesInDistrict.map((com, index) => (
              <SelectItem
                key={index}
                value={JSON.stringify({ name: com.name, id: com.idCommune })}
              >
                {com.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
