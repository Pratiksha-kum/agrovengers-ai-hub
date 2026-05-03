import { Sprout } from "lucide-react"

export function AgrovengersLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">A</span>
        </div>
      </div>
      <div>
        <div className="text-lg font-bold text-green-800 dark:text-green-400">Agrovengers</div>
        <div className="text-xs text-green-600 dark:text-green-300 -mt-1">Cropwise Innovation</div>
      </div>
    </div>
  )
}
