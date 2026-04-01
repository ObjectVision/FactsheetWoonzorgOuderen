import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown } from "lucide-react"

const KaartZoeker: React.FC = () => {
  return (
     <div className="flex flex-1 justify-center">
          <div className="flex max-w-3xl items-center gap-2 rounded-md border bg-white px-2 py-1 shadow-sm">
            <Button
              size="sm"
              className="rounded-sm bg-orange-500 px-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-orange-600"
            >
              Modeled data
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 px-2 text-xs font-medium"
                >
                  Eviction Filing Rate
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Eviction Filing Rate</DropdownMenuItem>
                <DropdownMenuItem>Eviction Judgement Rate</DropdownMenuItem>
                <DropdownMenuItem>Eviction Rate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-xs text-gray-500">and</span>

            {/* Population dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 px-2 text-xs font-medium"
                >
                  Population
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Population</DropdownMenuItem>
                <DropdownMenuItem>Renter Households</DropdownMenuItem>
                <DropdownMenuItem>Children in Renter Homes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-xs text-gray-500">for</span>

            {/* Geography dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 px-2 text-xs font-medium"
                >
                  Counties
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Counties</DropdownMenuItem>
                <DropdownMenuItem>States</DropdownMenuItem>
                <DropdownMenuItem>Cities</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-xs text-gray-500">in</span>

            {/* Year dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 px-2 text-xs font-medium"
                >
                  2018
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>2016</DropdownMenuItem>
                <DropdownMenuItem>2017</DropdownMenuItem>
                <DropdownMenuItem>2018</DropdownMenuItem>
                <DropdownMenuItem>2019</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
  )
}

export default KaartZoeker


   