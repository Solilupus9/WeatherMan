import {motion} from "motion/react";
import CurrentWeather from "@/components/currentWeather.tsx";
import HourlyTemperature from "@/components/hourlyTemperature.tsx";
import WeatherDetails from "@/components/weatherDetails.tsx";
import WeatherForecast from "@/components/weatherForecast.tsx";
import SunDetails from "@/components/sunDetails.tsx";
import PollutionDetails from "@/components/pollutionDetails.tsx";

export const MotionCurrentWeather = motion.create(CurrentWeather);
export const MotionHourlyTemperature = motion.create(HourlyTemperature);
export const MotionWeatherDetails = motion.create(WeatherDetails);
export const MotionWeatherForecast = motion.create(WeatherForecast);
export const MotionSunDetails = motion.create(SunDetails);
export const MotionPollutionDetails = motion.create(PollutionDetails);
