import {motion} from "framer-motion";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCw} from "lucide-react";
import {useState} from "react";

interface RefreshLocationButtonProps {
	handleRefresh: () => void;
	disabled?: boolean;
	handleHover?: (hovered: boolean) => void;
	weatherFetching?: boolean;
}

function RefreshLocationButton({handleRefresh, disabled, weatherFetching}: RefreshLocationButtonProps) {
	const [hovered, setHovered] = useState(false);

	return (
		<motion.div
			style={{display: "inline-block"}}
			animate={{width: hovered ? 'fit-content' : 40}}
			transition={{type: "spring", stiffness: 300, damping: 20}}
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
		>
			<Button
				variant="outline"
				onClick={handleRefresh}
				disabled={disabled}
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "start",
					overflow: "hidden"
				}}
			>
				<RefreshCw className={`size-4 ${weatherFetching ? 'animate-spin' : ''}`}/>
				<motion.span
					style={{marginLeft: 8, whiteSpace: "nowrap"}}
					animate={{opacity: hovered ? 1 : 0,x: hovered ? 0 : -10}}
					exit={{opacity: 0, x: -10}}
					transition={{duration: 0.2}}
				>
					Refresh Location
				</motion.span>
			</Button>
		</motion.div>
	);
}

export default RefreshLocationButton;