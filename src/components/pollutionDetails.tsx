import type {PollutionData} from "@/api/types.ts";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import { motion } from "motion/react";
import type {RefObject} from "react";

interface PollutionDetailsProps {
	data: PollutionData;
	ref:RefObject<HTMLDivElement>;
}

function PollutionDetails({data,ref}: PollutionDetailsProps) {

	const aqiLevels={
		1:{
			label: 'Good',
			textColor: 'text-green-500',
			borderColor: 'border-green-500',
		},
		2:{
			label: 'Fair',
			textColor: 'text-yellow-500',
			borderColor: 'border-yellow-500',
		},
		3:{
			label: 'Moderate',
			textColor: 'text-orange-500',
			borderColor: 'border-orange-500',
		},
		4:{
			label: 'Poor',
			textColor: 'text-purple-500',
			borderColor: 'border-purple-500',
		},
		5:{
			label: 'Very Poor',
			textColor: 'text-red-500',
			borderColor: 'border-red-500',
		},
	};

	const allowedKeys = ["pm2_5", "pm10", "no2", "o3", "so2", "co"];
	const componentsArray = Object.entries(data.list[0].components).filter(([key]) => allowedKeys.includes(key)).map(([key, value]) => ({ name: key, value:value }));

	return (
		<Card ref={ref}>
			<CardHeader>
				<CardTitle>Pollution Details</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={'grid md:grid-cols-3 gap-2'}>
					<motion.div whileHover={{scale:1.01}} className={'col-span-3'}>
						<div className={`flex items-center justify-between p-4 rounded-lg border-3 ${aqiLevels[data.list[0].main.aqi as keyof typeof aqiLevels].borderColor}`}>
							<span className={'text-md text-muted-foreground'}>Air Quality</span>
							<span className={`text-2xl font-semibold mr-64 ${aqiLevels[data.list[0].main.aqi as keyof typeof aqiLevels].textColor}`}>
								{aqiLevels[data.list[0].main.aqi as keyof typeof aqiLevels].label}
							</span>
						</div>
					</motion.div>
					{componentsArray.map((item, index) => (
						<motion.div whileHover={{scale:1.01}} key={index} className={'col-span-1'}>
							<div className={'flex items-center justify-between p-4 rounded-lg border'}>
								<span className={'text-md'}>{item.name.replace('_', '.').toUpperCase()}</span>
								<span className={'text-md text-muted-foreground font-semibold'}>{item.value.toFixed(2)}</span>
							</div>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default PollutionDetails;