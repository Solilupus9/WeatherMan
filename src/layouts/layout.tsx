"use client";


import {Outlet} from "react-router";
import Header from "@/components/header.tsx";
import {ExternalLink} from "lucide-react";

function Layout() {
	return (
		<div className={'bg-gradient-to-br from-background to-muted'}>
			<Header/>
			<main className={'min-h-screen container mx-auto px-4 py-8'}>
				<Outlet/>
			</main>
			<footer className={'border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60'}>
				<div className={'container mx-auto px-4 text-center text-gray-400'}>
					<p>Made by <a href={'https://github.com/Solilupus9'} target={'_blank'} className={'hover:text-neutral-300'}>Sol<ExternalLink className={'size-4 ml-1 mb-1 inline-block'}/></a></p>
					<p>Powered by React Router, Tanstack Query and ShadCN</p>
					<p>Weather data sourced from <a href={'https://openweathermap.org/'} className={'hover:text-neutral-300'}>openweathermap.org</a></p>
				</div>
			</footer>
		</div>
	);
}

export default Layout;