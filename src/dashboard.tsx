import { AppSidebar } from "./components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import Map from "./Map.tsx"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent
} from "@/components/ui/card"

import data from "./app/dashboard/data.json"

interface ChildProps {
  sourceJSON: JSON[]|undefined;
  layerJSON: JSON[]|undefined;
  selectedPolygons: GeoJSON.Feature[];
  setSelectedPolygons: React.Dispatch<React.SetStateAction<GeoJSON.Feature[]>>;
}

export default function Page({ sourceJSON, layerJSON, selectedPolygons, setSelectedPolygons }: ChildProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-1">
            <div className="flex flex-col gap-4 py-4 md:gap-1 md:py-1">
              <div className="px-1 lg:px-1">
                <Card className="w-1/2 rounded-2xl overflow-hidden p-0">
                    <CardContent className="p-0">
                        <Map  sourceJSON={sourceJSON} layerJSON={layerJSON} selectedPolygons={selectedPolygons} setSelectedPolygons={setSelectedPolygons}/>
                    </CardContent>
                </Card>
                
              </div>
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}