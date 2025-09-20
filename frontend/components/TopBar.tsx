
import { GithubPicker } from "react-color"
import { Circle, Pencil, RectangleHorizontalIcon, MoveRight, Trash2, Eraser } from "lucide-react";
import IconButton from "./IconButton";


type Tool = "circle" | "rect" | "pencil" | "arrow";

function Topbar({
    selectedTool, setSelectedTool, color, setColor, eraserOn, setEraserOn, clear
}: {
    selectedTool: Tool, 
    setSelectedTool: (s: Tool) => void, 
    color: string, 
    setColor: (c: string) => void, 
    eraserOn: boolean, 
    setEraserOn: (b: boolean) => void, 
    clear: () => void
}) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                <IconButton 
                    onClick={() => setSelectedTool("pencil")}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil size={20} />}
                />
                <IconButton 
                    onClick={() => setSelectedTool("rect")} 
                    activated={selectedTool === "rect"} 
                    icon={<RectangleHorizontalIcon size={20} />} 
                />
                <IconButton 
                    onClick={() => setSelectedTool("circle")} 
                    activated={selectedTool === "circle"} 
                    icon={<Circle size={20} />}
                />
                <IconButton 
                    onClick={() => setSelectedTool("arrow")} 
                    activated={selectedTool === "arrow"} 
                    icon={<MoveRight size={20} />}
                />
            </div>
            
            <div className="w-px h-8 bg-gray-700" />

            <GithubPicker color={color} onChange={(e: any) => setColor(e.hex)} />
            
            <div className="w-px h-8 bg-gray-700" />
            
            <div className="flex items-center gap-2">
                <IconButton
                    onClick={() => setEraserOn(!eraserOn)}
                    activated={eraserOn}
                    icon={<Eraser size={20}/>}
                />
                <IconButton
                    onClick={clear}
                    icon={<Trash2 size={20} />}
                />
            </div>
        </div>
    );
}
export default Topbar;