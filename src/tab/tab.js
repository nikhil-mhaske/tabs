import { InnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { TextControl, PanelBody } from "@wordpress/components";
import { subscribe } from "@wordpress/data";
import * as tablerIcons from "@tabler/icons-react";
import { useState } from "react";

const IconOptions = ({ tablerIconNames, onSelectTabIcon, activeIcon }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [hoveredIcon, setHoveredIcon] = useState(null);
  
	const filteredIcons = tablerIconNames
	  .filter((iconName) =>
		iconName.toLowerCase().includes(searchTerm.toLowerCase())
	  )
	  .slice(0, 20);
  
	const handleSearch = (event) => {
	  setSearchTerm(event.target.value);
	};
  
	const handleIconHover = (iconName) => {
	  setHoveredIcon(iconName);
	};
  
	const handleIconBlur = () => {
	  setHoveredIcon(null);
	};
  
	return (
	  <div className="icons">
		<input
		  type="text"
		  placeholder="Search Icons..."
		  value={searchTerm}
		  onChange={handleSearch}
		/>
		{filteredIcons.map((iconName) => {
		  const IconComponent = tablerIcons[iconName];
		  const isActive = activeIcon === iconName;
		  const isHovered = hoveredIcon === iconName;
		  const iconClass = `icon-option ${isActive ? "active" : ""} ${
			isHovered ? "hovered" : ""
		  }`;
  
		  return (
			<button
			  key={iconName}
			  className={iconClass}
			  onClick={() => onSelectTabIcon(iconName)}
			  onMouseEnter={() => handleIconHover(iconName)}
			  onMouseLeave={handleIconBlur}
			>
			  {<IconComponent />}
			</button>
		  );
		})}
	  </div>
	);
  };
  

registerBlockType("create-block/tab", {
	title: "Tab",
	icon: "welcome-add-page",
	parent: ["create-block/tabs"],
	category: "design",
	attributes: {
		tabLabel: {
			type: "string",
			default: "",
		},
		tabIcon: {
			type: "string",
			default: "plus",
		},
		blockIndex: {
			type: "number",
			default: "",
		},
	},

	edit: (props) => {
		const {
			attributes: { tabLabel, tabIcon, blockIndex },
			setAttributes,
		} = props;

		const tablerIconNames = Object.keys(tablerIcons);

		const TabIconComponent = tablerIcons[tabIcon];

		const parentBlockID = wp.data
			.select("core/block-editor")
			.getBlockParentsByBlockName(props.clientId, ["create-block/tabs"]);

		var savedBlockIndex = blockIndex;
		const getBlockIndex = wp.data
			.select("core/block-editor")
			.getBlockOrder(parentBlockID)
			.indexOf(props.clientId);

		const unsubscribe = subscribe(() => {
			var newBlockIndex = wp.data
				.select("core/block-editor")
				.getBlockOrder(parentBlockID)
				.indexOf(props.clientId);
			var blockIndexChange = newBlockIndex !== savedBlockIndex;

			if (blockIndexChange) {
				unsubscribe();
				setAttributes({ blockIndex: newBlockIndex });
				wp.data
					.dispatch("core/block-editor")
					.updateBlockAttributes(parentBlockID, { updateChild: true });
			}
		});

		const onChangeTabLabel = (newTabLabel) => {
			setAttributes({ tabLabel: newTabLabel });
			setAttributes({ blockIndex: getBlockIndex });
			wp.data
				.dispatch("core/block-editor")
				.updateBlockAttributes(parentBlockID, { updateChild: true });
		};

		const onSelectTabIcon = (icon) => {
			setAttributes({ tabIcon: icon });

			const parentBlockID = wp.data
				.select("core/block-editor")
				.getBlockParentsByBlockName(props.clientId, ["create-block/tabs"]);

			wp.data
				.dispatch("core/block-editor")
				.updateBlockAttributes(parentBlockID, {
					updateChild: true,
				});
		};

		return (
			<div className={props.className}>
				<div className="tab-title">
					{TabIconComponent && <TabIconComponent className="tab-icon" />}
					<TextControl
						className={"tab-label_input"}
						value={tabLabel}
						onChange={onChangeTabLabel}
						placeholder="Add Tab Label"
						type="text"
					/>
				</div>
				<InspectorControls>
					<PanelBody title="Icon Settings">
						<IconOptions
							tablerIconNames={tablerIconNames}
							onSelectTabIcon={onSelectTabIcon}
							activeIcon={tabIcon}
						/>
					</PanelBody>
				</InspectorControls>
				<div>
					<InnerBlocks placeholder="Tab Content Goes here..." />
				</div>
			</div>
		);
	},

	save: (props) => {
		const {
			attributes: { tabLabel, tabIcon },
		} = props;

		return (
			<div className="tab-panel" role="tabpanel" tabindex="0">
				<InnerBlocks.Content />
			</div>
		);
	},
});
