"use client";
import {
	motion,
	useMotionTemplate,
	useSpring,
} from "framer-motion";

import {  PropsWithChildren } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
	const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
	const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

	function onMouseMove({ currentTarget, clientX, clientY }: any) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
	const style = { maskImage, WebkitMaskImage: maskImage };

	return (
		<div
			onMouseMove={onMouseMove}
			className="group relative md:gap-8 hover:bg-zinc-800/10 border border-zinc-600 hover:border-zinc-400/50 rounded-xl overflow-hidden duration-700"
		>
			<div className="isolate pointer-events-none">
				<div className="z-0 absolute inset-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
				<motion.div
					className="z-10 absolute inset-0 bg-gradient-to-br via-zinc-100/10 opacity-100 group-hover:opacity-50 transition duration-1000"
					style={style}
				/>
				<motion.div
					className="z-10 absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-1000 mix-blend-overlay"
					style={style}
				/>
			</div>

			{children}
		</div>
	);
};



export const CardWithBackground: React.FC<PropsWithChildren> = ({ children }) => {
	const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
	const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

	function onMouseMove({ currentTarget, clientX, clientY }: any) {
		const { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
	const style = { maskImage, WebkitMaskImage: maskImage };

	return (
		<div
			onMouseMove={onMouseMove}
			className="group relative md:gap-8 hover:bg-zinc-800/10 border border-zinc-600 hover:border-zinc-400/50 rounded-xl overflow-hidden duration-700"
		>
			<div className="pointer-events-none">
				<div className="z-0 absolute inset-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
				<motion.div
					className="z-10 absolute inset-0 bg-gradient-to-br via-zinc-100/10 opacity-100 group-hover:opacity-50 transition duration-1000"
					style={style}
				/>
				<motion.div
					className="z-10 absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-1000 mix-blend-overlay"
					style={style}
				/>
			</div>

			{children}
		</div>
	);
};
