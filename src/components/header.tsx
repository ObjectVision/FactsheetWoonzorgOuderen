import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DataHeader() {
return (
  <div className="w-full flex justify-center mt-1">
    <div className="flex items-center text-base font-medium bg-white px-4 py-2 shadow-sm">
      <Select>
        <SelectTrigger className="text-orange-600 font-semibold bg-transparent border-none shadow-none">
          <SelectValue placeholder="BAT (Nultrede) woningen" 
          className="[&[data-placeholder]]:text-orange-600 text-orange-600"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="geschikte-woningvoorraad-bat">BAT (Nultrede) woningen</SelectItem>
        </SelectContent>
      </Select>

      <span className="text-black">en</span>

      <Select>
        <SelectTrigger className="text-indigo-700 font-semibold bg-transparent border-none shadow-none">
          <SelectValue placeholder="percentage ouderen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="percentage-ouderen">percentage ouderen</SelectItem>
        </SelectContent>
      </Select>

      <span className="text-black">voor</span>

      <Select>
        <SelectTrigger className="text-black font-semibold bg-transparent border-none shadow-none">
          <SelectValue placeholder="buurten" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="counties">buurten</SelectItem>
          <SelectItem value="states">wijken</SelectItem>
          <SelectItem value="metros">gemeenten</SelectItem>
        </SelectContent>
      </Select>

    <span className="text-black">in</span>
    <Select>
      <SelectTrigger className="text-black font-semibold bg-transparent border-none shadow-none">
        <SelectValue placeholder="2018" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2018">2018</SelectItem>
        <SelectItem value="2019">2019</SelectItem>
        <SelectItem value="2020">2020</SelectItem>
        <SelectItem value="2021">2021</SelectItem>
        <SelectItem value="2022">2022</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
);
}