//imports
import { __ } from "@wordpress/i18n";

import {
	InspectorControls,
	useBlockProps,
	InnerBlocks,
} from "@wordpress/block-editor";

import { PanelBody, ToggleControl } from "@wordpress/components";

import { useSelect } from "@wordpress/data";

import "./editor.scss"; //for editor side CSS
import "./tab/tab.js"; //Inner Block

export default function Edit(props) {
	const { attributes, setAttributes } = props;
	const { tabLabelsArray, updateChild, sideTabLayout, tabIconArray } = attributes;

	//called to build the tabLabelsArray
	const buildTabLabelsArray = () => {
		const parentBlockID = props.clientId;
		const { innerBlockCount } = useSelect((select) => ({
			innerBlockCount: select("core/block-editor").getBlockCount(parentBlockID),
		}));

		var tabLabels = [];

		for (let block = 0; block < innerBlockCount; block++) {
			let tabLabel = wp.data
				.select("core/block-editor")
				.getBlocks(parentBlockID)[block].attributes.tabLabel;
			tabLabels.push(tabLabel);
		}

		return tabLabels;
	};
	var tabLabels = buildTabLabelsArray();

	//called to build the tabIconsArray
	const buildTabIconsArray = () => {
		const parentBlockID = props.clientId;
		const { innerBlockCount } = useSelect((select) => ({
			innerBlockCount: select("core/block-editor").getBlockCount(parentBlockID),
		}));

		var tabIcons = [];

		for (let block = 0; block < innerBlockCount; block++) {
			
			let tabIcon = wp.data
				.select("core/block-editor")
				.getBlocks(parentBlockID)[block].attributes.tabIcon;
			tabIcons.push(tabIcon);
		}

		return tabIcons;
	};
	var tabIcons  = buildTabIconsArray();

	//check new tab added/ removed
	var labelLengthChange =
		tabLabels.length !== tabLabelsArray.length ||
		tabIcons.length !== tabIconArray.length;

	if (labelLengthChange || updateChild) {
		setAttributes({ tabLabelsArray: tabLabels });
		setAttributes({ tabIconArray: tabIcons });
		setAttributes({ updateChild: false });
	}

	const onChangeTabLabel = (toggle) => {
		setAttributes({ sideTabLayout: toggle });
	};

	return (
		<>
			<div {...useBlockProps()}>
				<InnerBlocks
					allowedBlocks={["create-block/tab"]}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>

			<InspectorControls>
				<PanelBody title={__("Tabs Settings", "tabs")}>
					<ToggleControl
						label="Tab Layout"
						help={sideTabLayout ? "Vertical" : "Horizontal"}
						checked={sideTabLayout}
						onChange={onChangeTabLabel}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
