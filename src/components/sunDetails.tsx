import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {format} from "date-fns";
import {Sunrise, Sunset} from "lucide-react";
import {Slider} from "radix-ui";
import {Tooltip, TooltipContent, TooltipTrigger,} from "@/components/ui/tooltip"
import type {RefObject} from "react";
import { motion } from "motion/react";


interface SunDetailsProps {
	sunriseTime: number;
	sunsetTime: number;
	ref:RefObject<HTMLDivElement>
}

function SunDetails({sunsetTime, sunriseTime,ref}: SunDetailsProps) {

	function formatTime(timestamp: number) {
		return format(new Date(timestamp * 1000), 'hh:mm a');
	}

	const now = Date.now() / 1000;
	const clamped = Math.max(sunriseTime, Math.min(now, sunsetTime));
	const percent = ((clamped - sunriseTime) / (sunsetTime - sunriseTime)) * 100;

	return (
		<Card ref={ref} className={'h-[179px]'}>
			<CardHeader>
				<CardTitle>Sunrise and Sunset</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={'flex gap-4 items-center'}>
					<div className={'flex flex-col items-center'}>
						<Sunrise className={'text-yellow-500 size-7 mb-2'}/>
						<span className={'text-sm text-neutral-400 w-full whitespace-nowrap tracking-tighter'}>{formatTime(sunriseTime)}</span>
					</div>
					<Slider.Root
						className="relative flex h-5 flex-1 touch-none select-none items-center"
						defaultValue={[percent]}
						max={100}
						step={1}
						disabled
					>
						<Slider.Track className="relative h-[3px] grow rounded-full bg-orange-500">
							<Slider.Range className="absolute h-full rounded-full bg-neutral-700"/>
						</Slider.Track>
						<Slider.Thumb
							className="w-7 h-7 flex items-center justify-center"
							aria-label="Volume"
						>
							<Tooltip>
								<TooltipTrigger>
									<motion.img
										whileHover={{scale: 1.1}}
										src={'/slider-sun.png'}
										alt={'Slider image'}
										className={'size-7'}
									/>
								</TooltipTrigger>
								<TooltipContent className={'bg-background shadow-sm p-2 flex items-center flex-col'}>
									<span className={'text-muted-foreground text-xs uppercase'}>Time till sunset</span>
									<span className={'text-lg text-neutral-400 font-bold'}>
										{(() => {
											const secondsLeft = Math.max(0, sunsetTime - now);
											const hours = Math.floor(secondsLeft / 3600);
											const minutes = Math.floor((secondsLeft % 3600) / 60);
											return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
										})()}
									</span>
								</TooltipContent>
							</Tooltip>
						</Slider.Thumb>
					</Slider.Root>

					<div className={'flex flex-col items-center'}>
						<Sunset className={'text-orange-500 size-7 mb-2'}/>
						<span className={'text-sm text-neutral-400 w-full whitespace-nowrap tracking-tighter'}>{formatTime(sunsetTime)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default SunDetails;