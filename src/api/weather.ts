import {API_CONFIG} from "@/api/config.ts";
import type {Coordinates, ForecastData, GeocodingResponse, PollutionData, WeatherData} from "@/api/types.ts";

class WeatherAPI {
	private createUrl(endpoint: string, params: Record<string, string | number>) {

		const searchParams = new URLSearchParams({
			appid: API_CONFIG.API_KEY,
			...params
		});

		return `${endpoint}?${searchParams.toString()}`;
	}

	private async fetchData<T>(url: string): Promise<T> {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Weather API error! status: ${response.status}`);
		}
		return response.json();
	}

	async getPollutionData({lat, lon}: Coordinates):Promise<PollutionData>{
		const url = this.createUrl(`${API_CONFIG.BASE_URL}/air_pollution`, {
			lat: lat.toString(),
			lon: lon.toString(),
			appid: API_CONFIG.API_KEY,
		});
		return this.fetchData<PollutionData>(url);
	}

	async getCurrentWeather({lat, lon}: Coordinates): Promise<WeatherData> {
		const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
			lat: lat.toString(),
			lon: lon.toString(),
			appid: API_CONFIG.API_KEY,
			units: API_CONFIG.DEFAULT_PARAMS.units,
		});

		return this.fetchData<WeatherData>(url);
	}

	async getWeatherForecast({lat, lon}: Coordinates): Promise<ForecastData>{
		const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
			lat: lat.toString(),
			lon: lon.toString(),
			units: API_CONFIG.DEFAULT_PARAMS.units,
		});

		return this.fetchData<ForecastData>(url);
	}

	async reverseGeocode({lat,lon}: Coordinates): Promise<GeocodingResponse[]> {
		const url=this.createUrl(`${API_CONFIG.GEOCODING_URL}/reverse`, {
			lat: lat.toString(),
			lon: lon.toString(),
			limit: 1,
		});

		return this.fetchData<GeocodingResponse[]>(url);
	}
	async searchLocations(query:string): Promise<GeocodingResponse[]> {
		const url=this.createUrl(`${API_CONFIG.GEOCODING_URL}/direct`, {
			limit: 5,
			q: query,
		});

		return this.fetchData<GeocodingResponse[]>(url);
	}
}

export const weatherAPI = new WeatherAPI();