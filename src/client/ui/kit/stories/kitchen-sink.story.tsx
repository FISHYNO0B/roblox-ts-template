import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import Avatar from "../components/avatar/avatar";
import Badge from "../components/badge/badge";
import Box from "../components/box/box";
import Button from "../components/button/button";
import Card, { CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card/card";
import Checkbox from "../components/checkbox/checkbox";
import Dialog, {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../components/dialog/dialog";
import Heading from "../components/heading/heading";
import Icon from "../components/icon/icon";
import ProgressBar from "../components/progress-bar/progress-bar";
import ScrollArea from "../components/scroll-area/scroll-area";
import Separator from "../components/separator/separator";
import Skeleton from "../components/skeleton/skeleton";
import Slider from "../components/slider/slider";
import Stack from "../components/stack/stack";
import Tabs, { TabsContent, TabsList, TabsTrigger } from "../components/tabs/tabs";
import Text from "../components/text/text";
import TextInput from "../components/text-input/text-input";
import { ToastProvider, useToast } from "../components/toast/toast";
import Toggle from "../components/toggle/toggle";
import Tooltip from "../components/tooltip/tooltip";
import { palette } from "../theme/colors";
import { gradients, GradientToken } from "../theme/gradients";
import { ThemeProvider, useTheme } from "../theme/provider";
import { radius, RadiusToken } from "../theme/radius";
import { spacing, SpacingToken } from "../theme/spacing";
import { darkTheme } from "../theme/theme";
import { fontSize, FontSizeToken } from "../theme/typography";

function Section(props: React.PropsWithChildren<{ title: string; layoutOrder: number }>) {
	return (
		<Box
			bg="card"
			border="border"
			radius="lg"
			padding={5}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
			layoutOrder={props.layoutOrder}
		>
			<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y}>
				<Heading text={props.title} level="subtitle" layoutOrder={0} />
				<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y} layoutOrder={1}>
					{props.children}
				</Stack>
			</Stack>
		</Box>
	);
}

function Swatch(props: { color: Color3; label: string; layoutOrder: number; foreground?: Color3 }) {
	const theme = useTheme();
	return (
		<frame
			BackgroundColor3={props.color}
			BorderSizePixel={0}
			Size={new UDim2(0, 96, 0, 64)}
			LayoutOrder={props.layoutOrder}
		>
			<uicorner CornerRadius={theme.radius.md} />
			<uistroke Color={theme.colors.border} Thickness={1} Transparency={0.5} />
			<textlabel
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundTransparency={1}
				FontFace={theme.typography.fontFace}
				Position={new UDim2(0.5, 0, 1, -6)}
				Size={new UDim2(1, -12, 0, 14)}
				Text={props.label}
				TextColor3={props.foreground ?? theme.colors.foreground}
				TextSize={theme.typography.size.xs}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</frame>
	);
}

function PaletteRow(props: { name: string; scale: Record<number, Color3>; layoutOrder: number }) {
	const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
	return (
		<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} layoutOrder={props.layoutOrder}>
			<Text text={props.name} size="lg" color="mutedForeground" layoutOrder={0} />
			<Stack
				direction="horizontal"
				spacing={2}
				wrap={true}
				automaticSize={Enum.AutomaticSize.Y}
				size={new UDim2(1, 0, 0, 0)}
				layoutOrder={1}
			>
				{keys.map((k, i) => {
					const fg = k >= 400 ? palette.slate[50] : palette.slate[900];
					return <Swatch color={props.scale[k]} label={`${k}`} layoutOrder={i} foreground={fg} />;
				})}
			</Stack>
		</Stack>
	);
}

function SemanticTokens() {
	const theme = useTheme();
	const entries: Array<[string, Color3, Color3 | undefined]> = [
		["background", theme.colors.background, theme.colors.foreground],
		["card", theme.colors.card, theme.colors.cardForeground],
		["popover", theme.colors.popover, theme.colors.popoverForeground],
		["primary", theme.colors.primary, theme.colors.primaryForeground],
		["secondary", theme.colors.secondary, theme.colors.secondaryForeground],
		["muted", theme.colors.muted, theme.colors.mutedForeground],
		["accent", theme.colors.accent, theme.colors.accentForeground],
		["destructive", theme.colors.destructive, theme.colors.destructiveForeground],
		["success", theme.colors.success, theme.colors.successForeground],
		["warning", theme.colors.warning, theme.colors.warningForeground],
		["border", theme.colors.border, undefined],
		["ring", theme.colors.ring, undefined],
	];
	return (
		<Stack
			direction="horizontal"
			spacing={2}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			{entries.map(([name, bg, fg], i) => (
				<Swatch color={bg} label={name} foreground={fg} layoutOrder={i} />
			))}
		</Stack>
	);
}

function SpacingScale() {
	const theme = useTheme();
	const tokens: Array<SpacingToken> = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
	return (
		<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.Y}>
			{tokens.map((t, i) => (
				<Stack
					direction="horizontal"
					spacing={2}
					align="center"
					automaticSize={Enum.AutomaticSize.Y}
					size={new UDim2(1, 0, 0, 22)}
					layoutOrder={i}
				>
					<Text
						text={`spacing[${tostring(t)}]`}
						size="sm"
						color="mutedForeground"
						frameSize={new UDim2(0, 80, 1, 0)}
						alignY="center"
					/>
					<frame
						BackgroundColor3={theme.colors.primary}
						BorderSizePixel={0}
						Size={new UDim2(0, spacing[t], 0, 14)}
						LayoutOrder={1}
					>
						<uicorner CornerRadius={theme.radius.sm} />
					</frame>
					<Text
						text={`${spacing[t]}px`}
						size="sm"
						color="mutedForeground"
						frameSize={new UDim2(0, 60, 1, 0)}
						alignY="center"
						layoutOrder={2}
					/>
				</Stack>
			))}
		</Stack>
	);
}

function RadiusScale() {
	const theme = useTheme();
	const tokens: Array<RadiusToken> = ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"];
	return (
		<Stack
			direction="horizontal"
			spacing={3}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			{tokens.map((t, i) => (
				<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.XY} layoutOrder={i}>
					<frame BackgroundColor3={theme.colors.primary} BorderSizePixel={0} Size={new UDim2(0, 64, 0, 64)}>
						<uicorner CornerRadius={radius[t]} />
					</frame>
					<Text text={t} size="sm" color="mutedForeground" align="center" layoutOrder={1} />
				</Stack>
			))}
		</Stack>
	);
}

function TypographyScale() {
	const tokens: Array<FontSizeToken> = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
	return (
		<Stack direction="vertical" spacing={1} automaticSize={Enum.AutomaticSize.Y}>
			{tokens.map((t, i) => (
				<Text text={`${t} — The quick brown fox (${fontSize[t]}px)`} size={t} layoutOrder={i} />
			))}
		</Stack>
	);
}

function GradientGrid() {
	const tokens: Array<GradientToken> = [
		"primary",
		"primarySheen",
		"accent",
		"destructive",
		"success",
		"warning",
		"surface",
		"surfaceTop",
		"shimmer",
	];
	return (
		<Stack
			direction="horizontal"
			spacing={2}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			{tokens.map((g, i) => {
				const def = gradients[g];
				return (
					<frame
						BackgroundColor3={palette.white}
						BorderSizePixel={0}
						Size={new UDim2(0, 160, 0, 80)}
						LayoutOrder={i}
					>
						<uicorner CornerRadius={radius.md} />
						<uigradient Color={def.color} Transparency={def.transparency} Rotation={def.rotation} />
						<textlabel
							AnchorPoint={new Vector2(0.5, 1)}
							BackgroundTransparency={1}
							FontFace={darkTheme.typography.fontFace}
							Position={new UDim2(0.5, 0, 1, -6)}
							Size={new UDim2(1, -12, 0, 14)}
							Text={g}
							TextColor3={palette.slate[950]}
							TextSize={fontSize.xs}
							TextXAlignment={Enum.TextXAlignment.Left}
						/>
					</frame>
				);
			})}
		</Stack>
	);
}

function ButtonsDemo() {
	return (
		<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y}>
			<Stack
				direction="horizontal"
				spacing={2}
				wrap={true}
				automaticSize={Enum.AutomaticSize.Y}
				size={new UDim2(1, 0, 0, 0)}
			>
				<Button text="Solid" variant="solid" />
				<Button text="Secondary" variant="secondary" />
				<Button text="Outline" variant="outline" />
				<Button text="Ghost" variant="ghost" />
				<Button text="Destructive" variant="destructive" />
				<Button text="Disabled" variant="solid" disabled={true} />
			</Stack>
			<Stack
				direction="horizontal"
				spacing={2}
				wrap={true}
				automaticSize={Enum.AutomaticSize.Y}
				size={new UDim2(1, 0, 0, 0)}
				layoutOrder={1}
			>
				<Button text="Small" variant="solid" size="sm" />
				<Button text="Medium" variant="solid" size="md" />
				<Button text="Large" variant="solid" size="lg" />
				<Button text="With icon" variant="solid" leftIcon={16545611198} />
				<Button variant="ghost" leftIcon={16545611198} />
			</Stack>
		</Stack>
	);
}

function BadgesDemo() {
	return (
		<Stack
			direction="horizontal"
			spacing={2}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			<Badge text="Default" variant="default" />
			<Badge text="Secondary" variant="secondary" />
			<Badge text="Accent" variant="accent" />
			<Badge text="Success" variant="success" />
			<Badge text="Warning" variant="warning" />
			<Badge text="Destructive" variant="destructive" />
			<Badge text="Outline" variant="outline" />
		</Stack>
	);
}

function CardsDemo() {
	return (
		<Stack
			direction="horizontal"
			spacing={3}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			<Card variant="default" size={new UDim2(0, 280, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
				<CardHeader>
					<CardTitle text="Default card" />
					<CardDescription text="Card with border and card background." />
				</CardHeader>
				<CardFooter>
					<Button text="Confirm" variant="solid" size="sm" />
					<Button text="Cancel" variant="ghost" size="sm" />
				</CardFooter>
			</Card>
			<Card variant="elevated" size={new UDim2(0, 280, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
				<CardHeader>
					<CardTitle text="Elevated card" />
					<CardDescription text="No border — leans on bg contrast." />
				</CardHeader>
				<CardFooter>
					<Button text="Action" variant="solid" size="sm" />
				</CardFooter>
			</Card>
			<Card variant="outline" size={new UDim2(0, 280, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
				<CardHeader>
					<CardTitle text="Outline card" />
					<CardDescription text="Border only — transparent background." />
				</CardHeader>
				<CardFooter>
					<Button text="Action" variant="outline" size="sm" />
				</CardFooter>
			</Card>
		</Stack>
	);
}

function IconsDemo() {
	return (
		<Stack
			direction="horizontal"
			spacing={3}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			<Box bg="card" radius="md" padding={3}>
				<Icon asset={16545611198} size={32} color="foreground" />
			</Box>
			<Box bg="card" radius="md" padding={3}>
				<Icon asset={15416676802} size={32} color="warning" />
			</Box>
			<Box bg="card" radius="md" padding={3}>
				<Icon asset={15416675953} size={32} color="accent" />
			</Box>
			<Box bg="card" radius="md" padding={3}>
				<Icon asset={16545611198} size={32} color="primary" />
			</Box>
			<Box bg="card" radius="md" padding={3}>
				<Icon asset={16545611198} size={32} color="destructive" />
			</Box>
		</Stack>
	);
}

function SeparatorsDemo() {
	return (
		<Stack direction="vertical" spacing={3} automaticSize={Enum.AutomaticSize.Y}>
			<Text text="Above the line" />
			<Separator />
			<Text text="Below the line" color="mutedForeground" />
			<Separator color="primary" thickness={2} />
			<Text text="Below an accent line" />
		</Stack>
	);
}

function HeadingsDemo() {
	return (
		<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y}>
			<Heading text="Display" level="display" />
			<Heading text="Title" level="title" />
			<Heading text="Subtitle" level="subtitle" />
			<Heading text="Section" level="section" />
			<Heading text="Label" level="label" />
		</Stack>
	);
}

function FormControlsDemo() {
	const [toggleA, setToggleA] = useState(true);
	const [toggleB, setToggleB] = useState(false);
	const [check, setCheck] = useState(true);
	const [slider, setSlider] = useState(35);
	const [text, setText] = useState("");
	return (
		<Stack
			direction="horizontal"
			spacing={5}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} size={new UDim2(0, 220, 0, 0)}>
				<Text text="Toggles" size="sm" color="mutedForeground" />
				<Stack direction="horizontal" spacing={3} align="center" automaticSize={Enum.AutomaticSize.Y}>
					<Toggle checked={toggleA} onChange={setToggleA} />
					<Toggle checked={toggleB} onChange={setToggleB} />
					<Toggle checked={true} disabled={true} />
				</Stack>
			</Stack>
			<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} size={new UDim2(0, 220, 0, 0)}>
				<Text text="Checkboxes" size="sm" color="mutedForeground" />
				<Checkbox checked={check} onChange={setCheck} label="Accept terms" />
			</Stack>
			<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} size={new UDim2(0, 280, 0, 0)}>
				<Text text="Slider" size="sm" color="mutedForeground" />
				<Slider value={slider} onChange={setSlider} min={0} max={100} />
				<Text text={`Value: ${slider}`} size="xs" color="mutedForeground" />
			</Stack>
			<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} size={new UDim2(0, 280, 0, 0)}>
				<Text text="TextInput" size="sm" color="mutedForeground" />
				<TextInput value={text} onChange={setText} placeholder="Type something..." />
			</Stack>
		</Stack>
	);
}

function DisplayDemo() {
	return (
		<Stack direction="vertical" spacing={4} automaticSize={Enum.AutomaticSize.Y}>
			<Stack direction="horizontal" spacing={2} align="end" automaticSize={Enum.AutomaticSize.Y}>
				<Avatar userId={1} fallback="Roblox" size="xs" />
				<Avatar userId={156} fallback="Builder" size="sm" status="online" />
				<Avatar userId={261} fallback="Shed" size="md" status="away" />
				<Avatar userId={469} fallback="P" size="lg" status="busy" />
				<Avatar fallback="Aria Stark" size="xl" status="offline" />
			</Stack>
			<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y}>
				<Text text="Determinate progress (40%)" size="sm" color="mutedForeground" />
				<ProgressBar value={0.4} max={1} />
				<Text text="Success" size="sm" color="mutedForeground" />
				<ProgressBar value={0.7} max={1} variant="success" />
				<Text text="Indeterminate" size="sm" color="mutedForeground" />
				<ProgressBar indeterminate={true} variant="accent" />
			</Stack>
		</Stack>
	);
}

function TabsDemo() {
	const [tab, setTab] = useState("pills");
	return (
		<Tabs value={tab} onChange={setTab} variant="pills" size="md">
			<TabsList>
				<TabsTrigger value="pills" text="Pills" layoutOrder={0} />
				<TabsTrigger value="underline" text="Underline" layoutOrder={1} />
				<TabsTrigger value="disabled" text="Disabled" disabled={true} layoutOrder={2} />
			</TabsList>
			<TabsContent value="pills">
				<Box bg="card" radius="md" padding={4} automaticSize={Enum.AutomaticSize.Y}>
					<Text text="Pills variant — solid background on active tab." color="mutedForeground" />
				</Box>
			</TabsContent>
			<TabsContent value="underline">
				<Box bg="card" radius="md" padding={4} automaticSize={Enum.AutomaticSize.Y}>
					<Text text="Underline variant — primary line under active tab." color="mutedForeground" />
				</Box>
			</TabsContent>
		</Tabs>
	);
}

function DialogDemo() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button text="Open dialog" onClick={() => setOpen(true)} />
			<Dialog open={open} onOpenChange={setOpen} size="md">
				<DialogHeader>
					<DialogTitle text="Are you sure?" />
					<DialogDescription text="This will permanently delete the highlighted items." />
				</DialogHeader>
				<DialogContent>
					<DialogDescription text="You can't undo this action." />
				</DialogContent>
				<DialogFooter>
					<Button text="Cancel" variant="ghost" onClick={() => setOpen(false)} />
					<Button text="Delete" variant="destructive" onClick={() => setOpen(false)} />
				</DialogFooter>
			</Dialog>
		</>
	);
}

function TooltipDemo() {
	return (
		<Stack direction="horizontal" spacing={6} align="center" automaticSize={Enum.AutomaticSize.Y}>
			<Tooltip content="Save (Ctrl+S)" delay={0.2}>
				<Button text="Save" variant="solid" />
			</Tooltip>
			<Tooltip content="Settings" side="right" delay={0.2}>
				<Button variant="ghost" leftIcon={16545611198} />
			</Tooltip>
			<Tooltip content="Tooltip on bottom" side="bottom" delay={0.2}>
				<Button text="Hover me" variant="outline" />
			</Tooltip>
		</Stack>
	);
}

function ToastDemoInner() {
	const { toast } = useToast();
	return (
		<Stack
			direction="horizontal"
			spacing={2}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			<Button
				text="Default"
				variant="solid"
				onClick={() => toast({ title: "Saved", description: "Your changes were saved." })}
			/>
			<Button
				text="Success"
				variant="solid"
				onClick={() => toast({ title: "Quest complete", description: "+250 gold", variant: "success" })}
			/>
			<Button
				text="Warning"
				variant="solid"
				onClick={() => toast({ title: "Connection unstable", variant: "warning" })}
			/>
			<Button
				text="Destructive"
				variant="destructive"
				onClick={() => toast({ title: "Save failed", description: "Try again.", variant: "destructive" })}
			/>
		</Stack>
	);
}

function SkeletonsDemo() {
	return (
		<Stack
			direction="horizontal"
			spacing={3}
			wrap={true}
			automaticSize={Enum.AutomaticSize.Y}
			size={new UDim2(1, 0, 0, 0)}
		>
			<Box bg="card" radius="md" padding={3} size={new UDim2(0, 240, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
				<Stack direction="horizontal" spacing={3} align="center" automaticSize={Enum.AutomaticSize.Y}>
					<Skeleton shape="circle" width={new UDim(0, 48)} height={new UDim(0, 48)} />
					<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y} layoutOrder={1}>
						<Skeleton shape="text" width={new UDim(0, 140)} height={new UDim(0, 14)} />
						<Skeleton shape="text" width={new UDim(0, 90)} height={new UDim(0, 12)} />
					</Stack>
				</Stack>
			</Box>
			<Box bg="card" radius="md" padding={3} size={new UDim2(0, 280, 0, 0)} automaticSize={Enum.AutomaticSize.Y}>
				<Stack direction="vertical" spacing={2} automaticSize={Enum.AutomaticSize.Y}>
					<Skeleton shape="rect" width={new UDim(1, 0)} height={new UDim(0, 80)} />
					<Skeleton shape="text" width={new UDim(1, 0)} height={new UDim(0, 16)} />
					<Skeleton shape="text" width={new UDim(0.6, 0)} height={new UDim(0, 14)} />
				</Stack>
			</Box>
		</Stack>
	);
}

function KitchenSink() {
	return (
		<ScrollArea size={new UDim2(1, 0, 1, 0)} padding={6} spacing={5}>
			<Heading text="UI Kit — Kitchen Sink" level="display" layoutOrder={0} />

			<Section title="Headings" layoutOrder={1}>
				<HeadingsDemo />
			</Section>

			<Section title="Buttons" layoutOrder={2}>
				<ButtonsDemo />
			</Section>

			<Section title="Badges" layoutOrder={3}>
				<BadgesDemo />
			</Section>

			<Section title="Cards" layoutOrder={4}>
				<CardsDemo />
			</Section>

			<Section title="Form controls" layoutOrder={5}>
				<FormControlsDemo />
			</Section>

			<Section title="Display (Avatar, ProgressBar)" layoutOrder={6}>
				<DisplayDemo />
			</Section>

			<Section title="Tabs" layoutOrder={7}>
				<TabsDemo />
			</Section>

			<Section title="Skeleton (loading)" layoutOrder={8}>
				<SkeletonsDemo />
			</Section>

			<Section title="Dialog" layoutOrder={9}>
				<DialogDemo />
			</Section>

			<Section title="Tooltip" layoutOrder={10}>
				<TooltipDemo />
			</Section>

			<Section title="Toast" layoutOrder={11}>
				<ToastDemoInner />
			</Section>

			<Section title="Icons" layoutOrder={12}>
				<IconsDemo />
			</Section>

			<Section title="Separators" layoutOrder={13}>
				<SeparatorsDemo />
			</Section>

			<Section title="Semantic tokens" layoutOrder={14}>
				<SemanticTokens />
			</Section>

			<Section title="Palette" layoutOrder={15}>
				<PaletteRow name="slate" scale={palette.slate} layoutOrder={0} />
				<PaletteRow name="blue" scale={palette.blue} layoutOrder={1} />
				<PaletteRow name="violet" scale={palette.violet} layoutOrder={2} />
				<PaletteRow name="emerald" scale={palette.emerald} layoutOrder={3} />
				<PaletteRow name="red" scale={palette.red} layoutOrder={4} />
				<PaletteRow name="amber" scale={palette.amber} layoutOrder={5} />
			</Section>

			<Section title="Spacing" layoutOrder={16}>
				<SpacingScale />
			</Section>

			<Section title="Radius" layoutOrder={17}>
				<RadiusScale />
			</Section>

			<Section title="Typography" layoutOrder={18}>
				<TypographyScale />
			</Section>

			<Section title="Gradients" layoutOrder={19}>
				<GradientGrid />
			</Section>
		</ScrollArea>
	);
}

const Story = {
	summary: "Kitchen sink — every theme token and component on one canvas",
	react: React,
	reactRoblox: ReactRoblox,
	story: () => (
		<ThemeProvider theme={darkTheme}>
			<ToastProvider>
				<Box bg="background" size={new UDim2(1, 0, 1, 0)}>
					<KitchenSink />
				</Box>
			</ToastProvider>
		</ThemeProvider>
	),
};

export = Story;
