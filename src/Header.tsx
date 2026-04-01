import * as React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const Header: React.FC = () => {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-15 max-w-6xl items-center gap-6 px-4 justify-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-wide text-[rgba(4,54,171,0.9)]">
            FoodValley WoonZorgwijzer-plus 
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header