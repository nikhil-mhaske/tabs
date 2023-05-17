import { InnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";

import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { TextControl, PanelBody, SelectControl } from "@wordpress/components";
import { subscribe } from "@wordpress/data";

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

		return (
			<div className={props.className}>
				<div className="tab-title">
				<span className={`dashicons dashicons-${tabIcon} tab-icon`} />
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
						<SelectControl
							label="Select Icon"
							options={[
								{ label: "Default", value: "plus" },
								{ label: "Admin Tools", value: "admin-tools" },
								{ label: "Archive", value: "archive" },
								// Add more options here
							]}
							value={tabIcon}
							onChange={(value) => {
								setAttributes({ tabIcon: value });
							}}
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
