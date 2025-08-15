import type {ForecastData} from "@/api/types.ts";
import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {format} from "date-fns";
import {motion} from "motion/react";
import type {RefObject} from "react";

interface HourlyTemperatureProps {
	data: ForecastData;
	isCityTemps: boolean;
	ref:RefObject<HTMLDivElement>;
}

function HourlyTemperature({data,isCityTemps,ref}: HourlyTemperatureProps) {

	const chartData = data.list.slice(0, isCityTemps?12:8).map((item) => ({
		time: format(new Date(item.dt * 1000), 'ha'),
		temp: Math.round(item.main.temp),
		feels_like: Math.round(item.main.feels_like),
	}));
	const {min:yMin,max:yMax} = chartData.reduce(
		(acc, d) => {
			acc.min = Math.min(acc.min, d.temp, d.feels_like);
			acc.max = Math.max(acc.max, d.temp, d.feels_like);
			return acc;
		},
		{min: Infinity, max: -Infinity}
	);

	const MotionCard = motion(Card);

	return (
		<MotionCard
			whileHover={{
				scale: 1.01
			}}
			className={'flex-1'}
			ref={ref}
		>
			<CardHeader>
				<CardTitle>Today's Temperature</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={'h-[200px] w-full'}>
					<ResponsiveContainer width={'100%'} height={'100%'}>
						<LineChart width={400} height={400} data={chartData}>
							<XAxis
								dataKey={'time'}
								stroke={'#888888'}
								tickLine={false}
								fontSize={12}
								axisLine={false}
							/>
							<YAxis
								dataKey={'temp'}
								stroke={'#888888'}
								tickLine={false}
								axisLine={false}
								fontSize={12}
								tickFormatter={(value) => `${value}°C`}
								domain={[yMin-1,yMax+1]}
							/>
							<Tooltip
								content={({active, payload}) => {
									if (active && payload && payload.length) {
										return (
											<div className={'rounded-lg border bg-background p-2 shadow-sm'}>
												<div className={'grid grid-cols-2 gap-2'}>
													<div className={'flex flex-col'}>
														<span
															className={'text-[0.70rem] uppercase text-muted-foreground'}>Temperature</span>
														<span className={'font-bold'}>{payload[0].value}&deg; </span>
													</div>
													<div className={'flex flex-col'}>
														<span
															className={'text-[0.70rem] uppercase text-muted-foreground'}>Feels like</span>
														<span className={'font-bold'}>{payload[1].value}&deg; </span>
													</div>
												</div>
											</div>
										)
									}
									return null;
								}}
							/>
							<Line
								type={'monotone'}
								dataKey={'temp'}
								stroke={'#8884d8'}
								strokeWidth={2}
								dot={false}
							/>
							<Line
								type={'monotone'}
								dataKey={'feels_like'}
								stroke={'#82ca9d'}
								strokeWidth={2}
								dot={false}
								strokeDasharray={'5 5'}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</MotionCard>
	);
}

export default HourlyTemperature;