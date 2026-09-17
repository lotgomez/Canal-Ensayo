// Garden Gnome Software - VR - Skin
// Pano2VR 8.0.5/22607
// Filename: Venis_VR.ggsk
// Generated 2026-09-17T04:45:40Z

function pano2vrVrSkin(player,base) {
	player.addVariable('node_cloner_vr_hasUp', 2, false, { ignoreInState: 0  });
	player.addVariable('node_cloner_vr_hasDown', 2, false, { ignoreInState: 0  });
	player.addVariable('vis_info_hotspots', 0, "", { ignoreInState: 0  });
	player.addVariable('vis_image_hotspots', 0, "", { ignoreInState: 0  });
	player.addVariable('vis_video_file_hotspots', 0, "", { ignoreInState: 0  });
	player.addVariable('vis_video_url_hotspots', 0, "", { ignoreInState: 0  });
	var me=this;
	var skin=this;
	var flag=false;
	var vrSkinAdded=false;
	var hotspotTemplates={};
	var skinKeyPressed = 0;
	this.player=player;
	this.player.vrSkinObj=this;
	this.rasterizeHTML = player.getRasterizeHTML();
	this.ggUserdata=player.userdata;
	this.lastSize={ w: -1,h: -1 };
	var basePath="";
	// auto detect base path
	if (base=='?') {
		var scripts = document.getElementsByTagName('script');
		for(var i=0;i<scripts.length;i++) {
			var src=scripts[i].src;
			if (src.indexOf('skin.js')>=0) {
				var p=src.lastIndexOf('/');
				if (p>=0) {
					basePath=src.substr(0,p+1);
				}
			}
		}
	} else
	if (base) {
		basePath=base;
	}
	this.elementMouseDown={};
	this.elementMouseOver={};
	var i;
	var hs,el,els,elo,ela,geometry,material;
	
	this.findElements=function(id,regex) {
		var r=[];
		var stack=[];
		var pat=new RegExp(id,'');
		stack.push(me.skinGroup);
		while(stack.length>0) {
			var e=stack.pop();
			if (regex) {
				if (pat.test(e.userData.ggId)) r.push(e);
			} else {
				if (e.userData.ggId==id) r.push(e);
			}
			if (e.children.length > 0) {
				for(var i=0;i<e.children.length;i++) {
					stack.push(e.children[i]);
				}
			}
		}
		return r;
	}
	
	this.posInSkin=function(el, clonerParent) {
		var curParent = el.parent;
		var pos = {x: el.position.x, y: el.position.y};
		while (curParent && curParent != me.skinGroup) {
			pos.x += curParent.position.x;
			pos.y += curParent.position.y;
			if (curParent.parent) {
				curParent = curParent.parent;
			} else {
				curParent = clonerParent
			}
		}
		return pos;
	}
	
	this._=function(text, params) {
		return player._(text, params);
	}
	this.languageChanged=function() {
		if (!me.skinGroup) return;
		var stack=[];
		stack.push(me.skinGroup);
		while(stack.length>0) {
			var e=stack.pop();
			if (e.userData && e.userData.ggUpdateText) {
				e.userData.ggUpdateText();
			}
			for(var i=0;i<e.children.length;i++) {
				stack.push(e.children[i]);
			}
		}
	}
	player.addListener('languagechanged', this.languageChanged);
	this.getClassStyles = function(className) {
		className = '.' + className;
		for (let sheet of document.styleSheets) {
			try {
				for (let rule of sheet.cssRules || sheet.rules) {
					if (rule.selectorText === className) {
						return rule.style;
					}
				}
			} catch (e) {
				console.warn("Cannot access stylesheet: ", e);
			}
		}
		return null;
	};
	this.paintTextDivToCanvas = function(el, stylesString, textureHeightFromEl, autoSize, scrollbar, measureOnly) {
		if (measureOnly === undefined) measureOnly = false;
		const skinStyles = skin.getClassStyles('ggskin');
		const skinTextStyles = skin.getClassStyles('ggskin_text');
		const skinStylesString = skinStyles ? skinStyles.cssText : '';
		const skinTextStylesString = skinTextStyles ? skinTextStyles.cssText : '';
		let elementStylesString = '';
		if (Array.isArray(el.userData.cssClasses)) {
			el.userData.cssClasses.forEach(function(className) {
				const classStyles = skin.getClassStyles(className);
				if (classStyles) {
					elementStylesString += classStyles.cssText;
				}
			});
		}
		const outerDiv = document.createElement('div');
		const textDiv = document.createElement('div');
		textDiv.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
		textDiv.style = skinStylesString + skinTextStylesString + elementStylesString + stylesString;
		textDiv.innerHTML = el.userData.ggText;
		textDiv.style.position = 'absolute';
		textDiv.style.left = '0px';
		textDiv.style.top = '0px';
		outerDiv.appendChild(textDiv);
		document.body.appendChild(outerDiv);
		el.userData.boxWidthCanv = textDiv.clientWidth;
		el.userData.totalHeightCanv = textDiv.clientHeight;
		elStyle = window.getComputedStyle(textDiv);
		const lineHeight = elStyle.lineHeight;
		if (lineHeight !== 'normal') {
			el.userData.lineHeight = parseFloat(lineHeight);
		} else {
			el.userData.lineHeight = parseFloat(elStyle.fontSize) * 1.2;
		}
		if (measureOnly) {
			document.body.removeChild(outerDiv);
			return;
		}
		var canv = el.userData.tmpCanvas;
		var ctx = el.userData.tmpCanvasContext;
		canv.width = textDiv.clientWidth * 2;
		canv.height = textDiv.clientHeight * 2;
		ctx.clearRect(0, 0, canv.width, canv.height);
		if (autoSize) {
			el.userData.boxHeightCanv = el.userData.totalHeightCanv;
		} else {
			el.userData.boxHeightCanv = el.userData.height;
		}
		if (scrollbar && textDiv.clientHeight > el.userData.height) {
			el.userData.textCanvas.width = el.userData.width * 2;
		} else {
			el.userData.textCanvas.width = el.userData.boxWidthCanv * 2;
		}
		el.userData.textCanvas.height = el.userData.boxHeightCanv * 2;
		this.rasterizeHTML.drawHTML(outerDiv.innerHTML, canv, {zoom: 2, baseUrl: player.getBasePath() }).then((renderResult) => {
			el.userData.ggTextureFromCanvas();
		}, (err) => {
			console.error('Error rendering HTML to canvas:', err);
		});
		document.body.removeChild(outerDiv);
	};
	this.rectMaxRadius = function(el) {
		return Math.min(el.userData.width / 2.0 + (el.userData.borderWidth.left + el.userData.borderWidth.right) / 2.0, el.userData.height / 2.0 + (el.userData.borderWidth.top + el.userData.borderWidth.bottom) / 2.0);
	}
	this.rectCalcBorderRadiiInnerShape = function(el) {
		let maxRad = skin.rectMaxRadius(el);
		let bwTopLeft = (el.userData.borderWidth.top + el.userData.borderWidth.left) / 2.0;
		let brTopLeft = Math.max(el.userData.borderRadius.topLeft - bwTopLeft, 0.0);
		brTopLeft = Math.min(brTopLeft, maxRad - bwTopLeft);
		let bwTopRight = (el.userData.borderWidth.top + el.userData.borderWidth.right) / 2.0;
		let brTopRight = Math.max(el.userData.borderRadius.topRight - bwTopRight, 0.0);
		brTopRight = Math.min(brTopRight, maxRad - bwTopRight);
		let bwBottomRight = (el.userData.borderWidth.bottom + el.userData.borderWidth.right) / 2.0;
		let brBottomRight = Math.max(el.userData.borderRadius.bottomRight - bwBottomRight, 0.0);
		brBottomRight = Math.min(brBottomRight, maxRad - bwBottomRight);
		let bwBottomLeft = (el.userData.borderWidth.bottom + el.userData.borderWidth.left) / 2.0;
		let brBottomLeft = Math.max(el.userData.borderRadius.bottomLeft - bwBottomLeft, 0.0);
		brBottomLeft = Math.min(brBottomLeft, maxRad - bwBottomLeft);
		el.userData.borderRadiusInnerShape = {
			topLeft: brTopLeft,
			topRight: brTopRight,
			bottomRight: brBottomRight,
			bottomLeft: brBottomLeft
		};
	}
	this.rectHasRoundedCorners = function(el) {
		return (el.userData.borderRadius.topLeft > 0 || el.userData.borderRadius.topRight > 0 || el.userData.borderRadius.bottomRight > 0 || el.userData.borderRadius.bottomLeft > 0);
	}
	this.disposeGeometryAndMaterial = function(el) {
		if (el.geometry) el.geometry.dispose();
		el.geometry = null;
		if (el.material) el.material.dispose();
	}
	this.removeChildren = function(el, filter) {
		if (filter === undefined) filter ='^.*$';
		const pattern = new RegExp(filter);
		for (let i = el.children.length - 1; i >= 0; i--) {
			let child = el.children[i];
			if (pattern.test(child.name)) {
				if (child.isMesh) {
					skin.disposeGeometryAndMaterial(child);
				}
				el.remove(child);
			}
		}
	};
	this.getDepthFrom = function(root, object) {
		let depth = 0;
		let current = object;
		while (current && current !== root) {
			if (current.userData && current.userData.hasOwnProperty('ggId')) depth++;
			current = current.parent;
		}
		return current === root ? depth : -1;
	};
	this.getElementVrPosition = function(el, x, y) {
		var vrPos = {};
		var renderableEl = el.parent && (el.parent.type == 'Mesh' || el.parent.type == 'Group');
		switch (el.userData.hanchor) {
			case 0:
			vrPos.x = (0) - ((renderableEl ? el.parent.userData.width : 800) / 200.0) + (x / 100.0) + (el.userData.width / 200.0);
			break;
			case 1:
			vrPos.x = (0) + (x / 100.0);
			break;
			case 2:
			vrPos.x = (0) + ((renderableEl ? el.parent.userData.width : 800) / 200.0) - (x / 100.0) - (el.userData.width / 200.0);
			break;
		}
		switch (el.userData.vanchor) {
			case 0:
			vrPos.y = (0) + ((renderableEl ? el.parent.userData.height : 600) / 200.0) - (y / 100.0) - (el.userData.height / 200.0);
			break;
			case 1:
			vrPos.y = (0) - (y / 100.0);
			break;
			case 2:
			vrPos.y = (0) - ((renderableEl ? el.parent.userData.height : 600) / 200.0) + (y / 100.0) + (el.userData.height / 200.0);
			break;
		}
		vrPos.x += el.userData.curScaleOffX;
		vrPos.y += el.userData.curScaleOffY;
		return vrPos;
	}
	this.skin_nodechangeCallback = function() {
		me.ggUserdata=player.userdata;
	};
	this.addSkin=function() {
		if (me.vrSkinAdded) return;
		me.vrSkinAdded = true;
		var hs='';
		this.ggCurrentTime=new Date().getTime();
		this.skinGroup=player.getSkinGroup();
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._thumbnails.visible = (v>0 && me._thumbnails.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 250;
		el.userData.height = 500;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'thumbnails';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.setOpacityInternal = function(v) {
			if (me._thumbnails.material) me._thumbnails.material.opacity = v;
			me._thumbnails.visible = (v>0 && me._thumbnails.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._thumbnails.visible
			let parentEl = me._thumbnails.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._thumbnails.userData.opacity = v;
			v = v * me._thumbnails.userData.parentOpacity;
			if (me._thumbnails.userData.setOpacityInternal) me._thumbnails.userData.setOpacityInternal(v);
			for (let i = 0; i < me._thumbnails.children.length; i++) {
				let child = me._thumbnails.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._thumbnails.userData.parentOpacity = v;
			v = v * me._thumbnails.userData.opacity
			if (me._thumbnails.userData.setOpacityInternal) me._thumbnails.userData.setOpacityInternal(v);
			for (let i = 0; i < me._thumbnails.children.length; i++) {
				let child = me._thumbnails.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._thumbnails = el;
		el.userData.ggId="thumbnails";
		me._thumbnails.userData.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._thumbnails.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getIsTour() == false))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._thumbnails.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._thumbnails.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._thumbnails.ggCurrentLogicStateVisible == 0) {
			me._thumbnails.visible=false;
			player.repaint();
			me._thumbnails.userData.visible=false;
				}
				else {
			me._thumbnails.visible=((!me._thumbnails.material && Number(me._thumbnails.userData.opacity>0)) || (me._thumbnails.material && Number(me._thumbnails.material.opacity)>0))?true:false;
			player.repaint();
			me._thumbnails.userData.visible=true;
				}
			}
		}
		me._thumbnails.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._node_cloner_vr.visible = (v>0 && me._node_cloner_vr.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(0);
		el.translateY(2.33);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 250;
		el.userData.height = 34;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'node_cloner_vr';
		el.userData.x = 0;
		el.userData.y = 2.33;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.setOpacityInternal = function(v) {
			if (me._node_cloner_vr.material) me._node_cloner_vr.material.opacity = v;
			me._node_cloner_vr.visible = (v>0 && me._node_cloner_vr.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._node_cloner_vr.visible
			let parentEl = me._node_cloner_vr.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._node_cloner_vr.userData.opacity = v;
			v = v * me._node_cloner_vr.userData.parentOpacity;
			if (me._node_cloner_vr.userData.setOpacityInternal) me._node_cloner_vr.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_cloner_vr.children.length; i++) {
				let child = me._node_cloner_vr.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._node_cloner_vr.userData.parentOpacity = v;
			v = v * me._node_cloner_vr.userData.opacity
			if (me._node_cloner_vr.userData.setOpacityInternal) me._node_cloner_vr.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_cloner_vr.children.length; i++) {
				let child = me._node_cloner_vr.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._node_cloner_vr = el;
		el.userData.ggNumRepeat = 100;
		el.userData.ggCloneOffset = 0;
		el.userData.ggNumRows = 0;
		el.userData.ggNumCols = 0;
		el.userData.ggUpdating = false;
		el.userData.ggFilter = [];
		el.userData.ggInstances = [];
		el.userData.ggGoUp = function() {
			if (me._node_cloner_vr.userData.ggCloneOffset + me._node_cloner_vr.userData.ggNumRows <= me._node_cloner_vr.userData.ggNumFilterPassed) {
				me._node_cloner_vr.userData.ggCloneOffset += me._node_cloner_vr.userData.ggNumRows;
				me._node_cloner_vr.userData.ggCloneOffsetChanged = true;
				me._node_cloner_vr.userData.ggUpdate();
			}
		}
		el.userData.ggGoDown = function() {
			if (me._node_cloner_vr.userData.ggCloneOffset > 0) {
				me._node_cloner_vr.userData.ggCloneOffset -= me._node_cloner_vr.userData.ggNumRows;
				me._node_cloner_vr.userData.ggCloneOffset = Math.max(me._node_cloner_vr.userData.ggCloneOffset, 0);
				me._node_cloner_vr.userData.ggCloneOffsetChanged = true;
				me._node_cloner_vr.userData.ggUpdate();
			}
		}
		el.getFilteredNodes = function(tourNodes, filter) {
			var filteredNodes = [];
			for (var i = 0; i < tourNodes.length; i++) {
				var nodeId = tourNodes[i];
				var passed = true;
				var nodeData = player.getNodeUserdata(nodeId);
				if (filter.length > 0) {
					for (var j=0; j < filter.length; j++) {
						if (!nodeData['tags'] || nodeData['tags'].indexOf(filter[j].trim()) == -1) passed = false;
					}
				}
				if (passed) {
					filteredNodes.push(nodeId);
				}
			}
			return filteredNodes;
		}
		el.userData.ggUpdate = function(filter) {
			if(me._node_cloner_vr.userData.ggUpdating == true) return;
			me._node_cloner_vr.userData.ggUpdating = true;
			var el=me._node_cloner_vr;
			var curNumRows = 0;
			var parentHeight = me._node_cloner_vr.parent.userData.height;
			me._node_cloner_vr.userData.offsetTop = (me._node_cloner_vr.parent.userData.height / 200.0) + me._node_cloner_vr.userData.y - (me._node_cloner_vr.userData.height / 200.0);
			curNumRows = Math.floor(((parentHeight - me._node_cloner_vr.userData.offsetTop) * me._node_cloner_vr.userData.ggNumRepeat / 100.0) / me._node_cloner_vr.userData.height);
			if (curNumRows < 1) curNumRows = 1;
			if (typeof filter=='object') {
				el.userData.ggFilter = filter;
			} else {
				filter = el.userData.ggFilter;
			};
			if (me.ggTag) filter.push(me.ggTag);
			filter=filter.sort();
			if ((el.userData.ggNumRows == curNumRows) && (el.userData.ggInstances.length > 0) && (filter.length === el.userData.ggCurrentFilter.length) && (filter.every(function(value, index) { return value === el.userData.ggCurrentFilter[index] }) ) && (!me._node_cloner_vr.userData.ggCloneOffsetChanged)) {
				me._node_cloner_vr.userData.ggUpdating = false;
				return;
			} else {
				el.userData.ggNumCols = 1;
				el.userData.ggNumRows = curNumRows;
			var centerOffsetHor = 0;
			var centerOffsetVert = 0;
				me._node_cloner_vr.userData.ggCloneOffsetChanged = false;
			}
			el.userData.ggCurrentFilter = filter;
			el.userData.ggInstances = [];
			el.remove(...el.children);
			var tourNodes = player.getNodeIds();
			var row = 0;
			var column = 0;
			var currentIndex = 0;
			var keepCloning = true;
			me._node_cloner_vr.userData.ggNumFilterPassed = 0;
			tourNodes = me._node_cloner_vr.getFilteredNodes(tourNodes, filter);
			me._node_cloner_vr.userData.ggNumFilterPassed = tourNodes.length;
			for (var i = 0; i < tourNodes.length; i++) {
				var nodeId = tourNodes[i];
				var nodeData = player.getNodeUserdata(nodeId);
				if (!keepCloning || i < me._node_cloner_vr.userData.ggCloneOffset) continue;
				var parameter={};
				parameter.top = -(centerOffsetVert / 100.0) - (row * me._node_cloner_vr.userData.height) / 100.0;
				parameter.left = (centerOffsetHor / 100.0) + (column * me._node_cloner_vr.userData.width) / 100.0;
				parameter.index=currentIndex;
				parameter.title=nodeData['title'];
				var inst = new SkinCloner_node_cloner_vr_Class(nodeId, me, el, parameter);
				currentIndex++;
				el.userData.ggInstances.push(inst);
				var bbox = new THREE.Box3().setFromObject(inst.__obj);
				var clonerPosInSkin = skin.posInSkin(me._node_cloner_vr, me.ggParent);
				if (bbox.min.x + clonerPosInSkin.x >= -4 && bbox.max.x + clonerPosInSkin.x <= 4 && bbox.min.y + clonerPosInSkin.y >= -3 && bbox.max.y + clonerPosInSkin.y <= 3) el.add(inst.__obj);
				row++;
				if (row >= el.userData.ggNumRows) {
					keepCloning = false;
				}
			}
			player.setVariableValue('node_cloner_vr_hasDown', me._node_cloner_vr.userData.ggCloneOffset > 0);
			player.setVariableValue('node_cloner_vr_hasUp', me._node_cloner_vr.userData.ggCloneOffset + me._node_cloner_vr.userData.ggNumRows < me._node_cloner_vr.userData.ggNumFilterPassed);
			me._node_cloner_vr.userData.ggNodeCount = me._node_cloner_vr.userData.ggNumFilterPassed;
			me._node_cloner_vr.userData.ggUpdating = false;
			player.triggerEvent('clonerchanged');
		}
		el.userData.ggFilter = [];
		el.userData.ggId="node_cloner_vr";
		me._node_cloner_vr.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._node_cloner_vr.userData.ggUpdatePosition=function (useTransition) {
		}
		me._thumbnails.add(me._node_cloner_vr);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._page_up.userData.svgGroupNormal) me._page_up.userData.setOpacityInState(me._page_up.userData.svgGroupNormal, v);
			if (me._page_up.userData.svgGroupOver) me._page_up.userData.setOpacityInState(me._page_up.userData.svgGroupOver, v);
			if (me._page_up.userData.svgGroupActive) me._page_up.userData.setOpacityInState(me._page_up.userData.svgGroupActive, v);
			me._page_up.visible = (v>0 && me._page_up.userData.visible);
		}
		el.translateX(1.525);
		el.translateY(1.825);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'page_up';
		el.userData.x = 1.525;
		el.userData.y = 1.825;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 2;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._page_up.visible
			let parentEl = me._page_up.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._page_up.userData.opacity = v;
			v = v * me._page_up.userData.parentOpacity;
			if (me._page_up.userData.setOpacityInternal) me._page_up.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_up.children.length; i++) {
				let child = me._page_up.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._page_up.userData.parentOpacity = v;
			v = v * me._page_up.userData.opacity
			if (me._page_up.userData.setOpacityInternal) me._page_up.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_up.children.length; i++) {
				let child = me._page_up.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._page_up = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'page_up_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'page_up_clickTargetMaterial';
		me._page_up.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._page_up.userData.clickTarget.name = 'page_up_clickTarget';
		me._page_up.userData.clickTarget.userData.clickInvisible = true;
		me._page_up.userData.clickTarget.visible = false;
		me._page_up.add(me._page_up.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/page_up.svg', me._page_up.userData.width / 100.0, me._page_up.userData.height / 100.0);
			me._page_up.add(group);
			me._page_up.userData.svgGroupNormal = group;
			me._page_up.userData.setOpacityInState(group, me._page_up.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="page_up";
		me._page_up.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._page_up.logicBlock_position = function() {
			var newLogicStatePosition;
			if (
				((player.getVariableValue('node_cloner_vr_hasDown') == false))
			)
			{
				newLogicStatePosition = 0;
			}
			else {
				newLogicStatePosition = -1;
			}
			if (me._page_up.ggCurrentLogicStatePosition != newLogicStatePosition) {
				me._page_up.ggCurrentLogicStatePosition = newLogicStatePosition;
				if (me._page_up.ggCurrentLogicStatePosition == 0) {
					var newPos = skin.getElementVrPosition(me._page_up, -50, 0);
					me._page_up.position.x = newPos.x;
					me._page_up.position.y = newPos.y;
				}
				else {
					var elPos = skin.getElementVrPosition(me._page_up, -50, 45);
					me._page_up.position.x = elPos.x;
					me._page_up.position.y = elPos.y;
				}
			}
		}
		me._page_up.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['page_up'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._page_up.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._page_up.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._page_up.ggCurrentLogicStateScaling == 0) {
					me._page_up.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._page_up.userData.transitions.length; i++) {
						if (me._page_up.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_up.userData.transitions[i].interval);
							me._page_up.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_up.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_up.scale.set(transition_scale.startScale.x + (me._page_up.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_up.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_up.position.x = (me._page_up.position.x - me._page_up.userData.curScaleOffX) + scaleOffX;
							me._page_up.userData.curScaleOffX = scaleOffX;
							me._page_up.position.y = (me._page_up.position.y - me._page_up.userData.curScaleOffY) + scaleOffY;
							me._page_up.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_up.userData.transitions.splice(me._page_up.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_up.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._page_up.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._page_up.userData.transitions.length; i++) {
						if (me._page_up.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_up.userData.transitions[i].interval);
							me._page_up.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_up.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_up.scale.set(transition_scale.startScale.x + (me._page_up.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_up.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_up.position.x = (me._page_up.position.x - me._page_up.userData.curScaleOffX) + scaleOffX;
							me._page_up.userData.curScaleOffX = scaleOffX;
							me._page_up.position.y = (me._page_up.position.y - me._page_up.userData.curScaleOffY) + scaleOffY;
							me._page_up.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_up.userData.transitions.splice(me._page_up.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_up.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._page_up.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('node_cloner_vr_hasUp') == true))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._page_up.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._page_up.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._page_up.ggCurrentLogicStateVisible == 0) {
			me._page_up.visible=((!me._page_up.material && Number(me._page_up.userData.opacity>0)) || (me._page_up.material && Number(me._page_up.material.opacity)>0))?true:false;
			player.repaint();
			me._page_up.userData.visible=true;
				}
				else {
			me._page_up.visible=false;
			player.repaint();
			me._page_up.userData.visible=false;
				}
			}
		}
		me._page_up.userData.onclick=function (e) {
			skin.findElements('node_cloner_vr')[0].userData.ggGoUp();
		}
		me._page_up.userData.hasOwnClickAction = true;
		me._page_up.userData.onmouseenter=function (e) {
			me.elementMouseOver['page_up']=true;
			me._page_up.logicBlock_scaling();
		}
		me._page_up.userData.ontouchend=function (e) {
			me._page_up.logicBlock_scaling();
		}
		me._page_up.userData.onmouseleave=function (e) {
			me.elementMouseOver['page_up']=false;
			me._page_up.logicBlock_scaling();
		}
		me._page_up.userData.ggUpdatePosition=function (useTransition) {
		}
		me._thumbnails.add(me._page_up);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._page_down.userData.svgGroupNormal) me._page_down.userData.setOpacityInState(me._page_down.userData.svgGroupNormal, v);
			if (me._page_down.userData.svgGroupOver) me._page_down.userData.setOpacityInState(me._page_down.userData.svgGroupOver, v);
			if (me._page_down.userData.svgGroupActive) me._page_down.userData.setOpacityInState(me._page_down.userData.svgGroupActive, v);
			me._page_down.visible = (v>0 && me._page_down.userData.visible);
		}
		el.translateX(1.525);
		el.translateY(2.275);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'page_down';
		el.userData.x = 1.525;
		el.userData.y = 2.275;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 2;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._page_down.visible
			let parentEl = me._page_down.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._page_down.userData.opacity = v;
			v = v * me._page_down.userData.parentOpacity;
			if (me._page_down.userData.setOpacityInternal) me._page_down.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_down.children.length; i++) {
				let child = me._page_down.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._page_down.userData.parentOpacity = v;
			v = v * me._page_down.userData.opacity
			if (me._page_down.userData.setOpacityInternal) me._page_down.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_down.children.length; i++) {
				let child = me._page_down.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._page_down = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'page_down_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'page_down_clickTargetMaterial';
		me._page_down.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._page_down.userData.clickTarget.name = 'page_down_clickTarget';
		me._page_down.userData.clickTarget.userData.clickInvisible = true;
		me._page_down.userData.clickTarget.visible = false;
		me._page_down.add(me._page_down.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/page_down.svg', me._page_down.userData.width / 100.0, me._page_down.userData.height / 100.0);
			me._page_down.add(group);
			me._page_down.userData.svgGroupNormal = group;
			me._page_down.userData.setOpacityInState(group, me._page_down.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="page_down";
		me._page_down.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._page_down.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['page_down'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._page_down.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._page_down.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._page_down.ggCurrentLogicStateScaling == 0) {
					me._page_down.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._page_down.userData.transitions.length; i++) {
						if (me._page_down.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_down.userData.transitions[i].interval);
							me._page_down.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_down.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_down.scale.set(transition_scale.startScale.x + (me._page_down.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_down.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_down.position.x = (me._page_down.position.x - me._page_down.userData.curScaleOffX) + scaleOffX;
							me._page_down.userData.curScaleOffX = scaleOffX;
							me._page_down.position.y = (me._page_down.position.y - me._page_down.userData.curScaleOffY) + scaleOffY;
							me._page_down.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_down.userData.transitions.splice(me._page_down.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_down.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._page_down.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._page_down.userData.transitions.length; i++) {
						if (me._page_down.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_down.userData.transitions[i].interval);
							me._page_down.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_down.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_down.scale.set(transition_scale.startScale.x + (me._page_down.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_down.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_down.position.x = (me._page_down.position.x - me._page_down.userData.curScaleOffX) + scaleOffX;
							me._page_down.userData.curScaleOffX = scaleOffX;
							me._page_down.position.y = (me._page_down.position.y - me._page_down.userData.curScaleOffY) + scaleOffY;
							me._page_down.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_down.userData.transitions.splice(me._page_down.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_down.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._page_down.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('node_cloner_vr_hasDown') == true))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._page_down.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._page_down.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._page_down.ggCurrentLogicStateVisible == 0) {
			me._page_down.visible=((!me._page_down.material && Number(me._page_down.userData.opacity>0)) || (me._page_down.material && Number(me._page_down.material.opacity)>0))?true:false;
			player.repaint();
			me._page_down.userData.visible=true;
				}
				else {
			me._page_down.visible=false;
			player.repaint();
			me._page_down.userData.visible=false;
				}
			}
		}
		me._page_down.userData.onclick=function (e) {
			skin.findElements('node_cloner_vr')[0].userData.ggGoDown();
		}
		me._page_down.userData.hasOwnClickAction = true;
		me._page_down.userData.onmouseenter=function (e) {
			me.elementMouseOver['page_down']=true;
			me._page_down.logicBlock_scaling();
		}
		me._page_down.userData.ontouchend=function (e) {
			me._page_down.logicBlock_scaling();
		}
		me._page_down.userData.onmouseleave=function (e) {
			me.elementMouseOver['page_down']=false;
			me._page_down.logicBlock_scaling();
		}
		me._page_down.userData.ggUpdatePosition=function (useTransition) {
		}
		me._thumbnails.add(me._page_down);
		me.skinGroup.add(me._thumbnails);
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me.__close_skin.visible = (v>0 && me.__close_skin.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(-3.275);
		el.translateY(2.275);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = '_close_skin';
		el.userData.x = -3.275;
		el.userData.y = 2.275;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.setOpacityInternal = function(v) {
			if (me.__close_skin.material) me.__close_skin.material.opacity = v;
			me.__close_skin.visible = (v>0 && me.__close_skin.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me.__close_skin.visible
			let parentEl = me.__close_skin.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me.__close_skin.userData.opacity = v;
			v = v * me.__close_skin.userData.parentOpacity;
			if (me.__close_skin.userData.setOpacityInternal) me.__close_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me.__close_skin.children.length; i++) {
				let child = me.__close_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me.__close_skin.userData.parentOpacity = v;
			v = v * me.__close_skin.userData.opacity
			if (me.__close_skin.userData.setOpacityInternal) me.__close_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me.__close_skin.children.length; i++) {
				let child = me.__close_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me.__close_skin = el;
		el.userData.ggId="_close_skin";
		me.__close_skin.userData.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me.__close_skin.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._exit_vr_close.userData.svgGroupNormal) me._exit_vr_close.userData.setOpacityInState(me._exit_vr_close.userData.svgGroupNormal, v);
			if (me._exit_vr_close.userData.svgGroupOver) me._exit_vr_close.userData.setOpacityInState(me._exit_vr_close.userData.svgGroupOver, v);
			if (me._exit_vr_close.userData.svgGroupActive) me._exit_vr_close.userData.setOpacityInState(me._exit_vr_close.userData.svgGroupActive, v);
			me._exit_vr_close.visible = (v>0 && me._exit_vr_close.userData.visible);
		}
		el.translateX(0);
		el.translateY(-0.44);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'exit_vr_close';
		el.userData.x = 0;
		el.userData.y = -0.44;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._exit_vr_close.visible
			let parentEl = me._exit_vr_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._exit_vr_close.userData.opacity = v;
			v = v * me._exit_vr_close.userData.parentOpacity;
			if (me._exit_vr_close.userData.setOpacityInternal) me._exit_vr_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr_close.children.length; i++) {
				let child = me._exit_vr_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._exit_vr_close.userData.parentOpacity = v;
			v = v * me._exit_vr_close.userData.opacity
			if (me._exit_vr_close.userData.setOpacityInternal) me._exit_vr_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr_close.children.length; i++) {
				let child = me._exit_vr_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._exit_vr_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'exit_vr_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'exit_vr_close_clickTargetMaterial';
		me._exit_vr_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._exit_vr_close.userData.clickTarget.name = 'exit_vr_close_clickTarget';
		me._exit_vr_close.userData.clickTarget.userData.clickInvisible = true;
		me._exit_vr_close.userData.clickTarget.visible = false;
		me._exit_vr_close.add(me._exit_vr_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/exit_vr_close.svg', me._exit_vr_close.userData.width / 100.0, me._exit_vr_close.userData.height / 100.0);
			me._exit_vr_close.add(group);
			me._exit_vr_close.userData.svgGroupNormal = group;
			me._exit_vr_close.userData.setOpacityInState(group, me._exit_vr_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="exit_vr_close";
		me._exit_vr_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._exit_vr_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['exit_vr_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._exit_vr_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._exit_vr_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._exit_vr_close.ggCurrentLogicStateScaling == 0) {
					me._exit_vr_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._exit_vr_close.userData.transitions.length; i++) {
						if (me._exit_vr_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._exit_vr_close.userData.transitions[i].interval);
							me._exit_vr_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._exit_vr_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._exit_vr_close.scale.set(transition_scale.startScale.x + (me._exit_vr_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._exit_vr_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._exit_vr_close.position.x = (me._exit_vr_close.position.x - me._exit_vr_close.userData.curScaleOffX) + scaleOffX;
							me._exit_vr_close.userData.curScaleOffX = scaleOffX;
							me._exit_vr_close.position.y = (me._exit_vr_close.position.y - me._exit_vr_close.userData.curScaleOffY) + scaleOffY;
							me._exit_vr_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._exit_vr_close.userData.transitions.splice(me._exit_vr_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._exit_vr_close.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._exit_vr_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._exit_vr_close.userData.transitions.length; i++) {
						if (me._exit_vr_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._exit_vr_close.userData.transitions[i].interval);
							me._exit_vr_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._exit_vr_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._exit_vr_close.scale.set(transition_scale.startScale.x + (me._exit_vr_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._exit_vr_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._exit_vr_close.position.x = (me._exit_vr_close.position.x - me._exit_vr_close.userData.curScaleOffX) + scaleOffX;
							me._exit_vr_close.userData.curScaleOffX = scaleOffX;
							me._exit_vr_close.position.y = (me._exit_vr_close.position.y - me._exit_vr_close.userData.curScaleOffY) + scaleOffY;
							me._exit_vr_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._exit_vr_close.userData.transitions.splice(me._exit_vr_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._exit_vr_close.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._exit_vr_close.userData.onclick=function (e) {
			player.exitVR();
			player.setVRSkinVisibility("0");
		}
		me._exit_vr_close.userData.hasOwnClickAction = true;
		me._exit_vr_close.userData.onmouseenter=function (e) {
			me.elementMouseOver['exit_vr_close']=true;
			me._exit_vr_close.logicBlock_scaling();
		}
		me._exit_vr_close.userData.ontouchend=function (e) {
			me._exit_vr_close.logicBlock_scaling();
		}
		me._exit_vr_close.userData.onmouseleave=function (e) {
			me.elementMouseOver['exit_vr_close']=false;
			me._exit_vr_close.logicBlock_scaling();
		}
		me._exit_vr_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me.__close_skin.add(me._exit_vr_close);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._close_skin.userData.svgGroupNormal) me._close_skin.userData.setOpacityInState(me._close_skin.userData.svgGroupNormal, v);
			if (me._close_skin.userData.svgGroupOver) me._close_skin.userData.setOpacityInState(me._close_skin.userData.svgGroupOver, v);
			if (me._close_skin.userData.svgGroupActive) me._close_skin.userData.setOpacityInState(me._close_skin.userData.svgGroupActive, v);
			me._close_skin.visible = (v>0 && me._close_skin.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'close_skin';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._close_skin.visible
			let parentEl = me._close_skin.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._close_skin.userData.opacity = v;
			v = v * me._close_skin.userData.parentOpacity;
			if (me._close_skin.userData.setOpacityInternal) me._close_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me._close_skin.children.length; i++) {
				let child = me._close_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._close_skin.userData.parentOpacity = v;
			v = v * me._close_skin.userData.opacity
			if (me._close_skin.userData.setOpacityInternal) me._close_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me._close_skin.children.length; i++) {
				let child = me._close_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._close_skin = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'close_skin_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'close_skin_clickTargetMaterial';
		me._close_skin.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._close_skin.userData.clickTarget.name = 'close_skin_clickTarget';
		me._close_skin.userData.clickTarget.userData.clickInvisible = true;
		me._close_skin.userData.clickTarget.visible = false;
		me._close_skin.add(me._close_skin.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/close_skin.svg', me._close_skin.userData.width / 100.0, me._close_skin.userData.height / 100.0);
			me._close_skin.add(group);
			me._close_skin.userData.svgGroupNormal = group;
			me._close_skin.userData.setOpacityInState(group, me._close_skin.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="close_skin";
		me._close_skin.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._close_skin.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['close_skin'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._close_skin.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._close_skin.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._close_skin.ggCurrentLogicStateScaling == 0) {
					me._close_skin.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._close_skin.userData.transitions.length; i++) {
						if (me._close_skin.userData.transitions[i].property == 'scale') {
							clearInterval(me._close_skin.userData.transitions[i].interval);
							me._close_skin.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._close_skin.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._close_skin.scale.set(transition_scale.startScale.x + (me._close_skin.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._close_skin.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._close_skin.position.x = (me._close_skin.position.x - me._close_skin.userData.curScaleOffX) + scaleOffX;
							me._close_skin.userData.curScaleOffX = scaleOffX;
							me._close_skin.position.y = (me._close_skin.position.y - me._close_skin.userData.curScaleOffY) + scaleOffY;
							me._close_skin.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._close_skin.userData.transitions.splice(me._close_skin.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._close_skin.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._close_skin.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._close_skin.userData.transitions.length; i++) {
						if (me._close_skin.userData.transitions[i].property == 'scale') {
							clearInterval(me._close_skin.userData.transitions[i].interval);
							me._close_skin.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._close_skin.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._close_skin.scale.set(transition_scale.startScale.x + (me._close_skin.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._close_skin.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._close_skin.position.x = (me._close_skin.position.x - me._close_skin.userData.curScaleOffX) + scaleOffX;
							me._close_skin.userData.curScaleOffX = scaleOffX;
							me._close_skin.position.y = (me._close_skin.position.y - me._close_skin.userData.curScaleOffY) + scaleOffY;
							me._close_skin.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._close_skin.userData.transitions.splice(me._close_skin.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._close_skin.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._close_skin.userData.onclick=function (e) {
			player.setVRSkinVisibility("0");
		}
		me._close_skin.userData.hasOwnClickAction = true;
		me._close_skin.userData.onmouseenter=function (e) {
			me.elementMouseOver['close_skin']=true;
			me._close_skin.logicBlock_scaling();
		}
		me._close_skin.userData.ontouchend=function (e) {
			me._close_skin.logicBlock_scaling();
		}
		me._close_skin.userData.onmouseleave=function (e) {
			me.elementMouseOver['close_skin']=false;
			me._close_skin.logicBlock_scaling();
		}
		me._close_skin.userData.ggUpdatePosition=function (useTransition) {
		}
		me.__close_skin.add(me._close_skin);
		me.player.setVRHideSkinButton(me.__close_skin);
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me.__open_skin.visible = (v>0 && me.__open_skin.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(-3.275);
		el.translateY(2.275);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = '_open_skin';
		el.userData.x = -3.275;
		el.userData.y = 2.275;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.setOpacityInternal = function(v) {
			if (me.__open_skin.material) me.__open_skin.material.opacity = v;
			me.__open_skin.visible = (v>0 && me.__open_skin.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me.__open_skin.visible
			let parentEl = me.__open_skin.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me.__open_skin.userData.opacity = v;
			v = v * me.__open_skin.userData.parentOpacity;
			if (me.__open_skin.userData.setOpacityInternal) me.__open_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me.__open_skin.children.length; i++) {
				let child = me.__open_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me.__open_skin.userData.parentOpacity = v;
			v = v * me.__open_skin.userData.opacity
			if (me.__open_skin.userData.setOpacityInternal) me.__open_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me.__open_skin.children.length; i++) {
				let child = me.__open_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me.__open_skin = el;
		el.userData.ggId="_open_skin";
		me.__open_skin.userData.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me.__open_skin.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._exit_vr_open.userData.svgGroupNormal) me._exit_vr_open.userData.setOpacityInState(me._exit_vr_open.userData.svgGroupNormal, v);
			if (me._exit_vr_open.userData.svgGroupOver) me._exit_vr_open.userData.setOpacityInState(me._exit_vr_open.userData.svgGroupOver, v);
			if (me._exit_vr_open.userData.svgGroupActive) me._exit_vr_open.userData.setOpacityInState(me._exit_vr_open.userData.svgGroupActive, v);
			me._exit_vr_open.visible = (v>0 && me._exit_vr_open.userData.visible);
		}
		el.translateX(0);
		el.translateY(-0.44);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'exit_vr_open';
		el.userData.x = 0;
		el.userData.y = -0.44;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._exit_vr_open.visible
			let parentEl = me._exit_vr_open.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._exit_vr_open.userData.opacity = v;
			v = v * me._exit_vr_open.userData.parentOpacity;
			if (me._exit_vr_open.userData.setOpacityInternal) me._exit_vr_open.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr_open.children.length; i++) {
				let child = me._exit_vr_open.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._exit_vr_open.userData.parentOpacity = v;
			v = v * me._exit_vr_open.userData.opacity
			if (me._exit_vr_open.userData.setOpacityInternal) me._exit_vr_open.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr_open.children.length; i++) {
				let child = me._exit_vr_open.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._exit_vr_open = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'exit_vr_open_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'exit_vr_open_clickTargetMaterial';
		me._exit_vr_open.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._exit_vr_open.userData.clickTarget.name = 'exit_vr_open_clickTarget';
		me._exit_vr_open.userData.clickTarget.userData.clickInvisible = true;
		me._exit_vr_open.userData.clickTarget.visible = false;
		me._exit_vr_open.add(me._exit_vr_open.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/exit_vr_open.svg', me._exit_vr_open.userData.width / 100.0, me._exit_vr_open.userData.height / 100.0);
			me._exit_vr_open.add(group);
			me._exit_vr_open.userData.svgGroupNormal = group;
			me._exit_vr_open.userData.setOpacityInState(group, me._exit_vr_open.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="exit_vr_open";
		me._exit_vr_open.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._exit_vr_open.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['exit_vr_open'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._exit_vr_open.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._exit_vr_open.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._exit_vr_open.ggCurrentLogicStateScaling == 0) {
					me._exit_vr_open.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._exit_vr_open.userData.transitions.length; i++) {
						if (me._exit_vr_open.userData.transitions[i].property == 'scale') {
							clearInterval(me._exit_vr_open.userData.transitions[i].interval);
							me._exit_vr_open.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._exit_vr_open.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._exit_vr_open.scale.set(transition_scale.startScale.x + (me._exit_vr_open.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._exit_vr_open.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._exit_vr_open.position.x = (me._exit_vr_open.position.x - me._exit_vr_open.userData.curScaleOffX) + scaleOffX;
							me._exit_vr_open.userData.curScaleOffX = scaleOffX;
							me._exit_vr_open.position.y = (me._exit_vr_open.position.y - me._exit_vr_open.userData.curScaleOffY) + scaleOffY;
							me._exit_vr_open.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._exit_vr_open.userData.transitions.splice(me._exit_vr_open.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._exit_vr_open.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._exit_vr_open.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._exit_vr_open.userData.transitions.length; i++) {
						if (me._exit_vr_open.userData.transitions[i].property == 'scale') {
							clearInterval(me._exit_vr_open.userData.transitions[i].interval);
							me._exit_vr_open.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._exit_vr_open.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._exit_vr_open.scale.set(transition_scale.startScale.x + (me._exit_vr_open.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._exit_vr_open.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._exit_vr_open.position.x = (me._exit_vr_open.position.x - me._exit_vr_open.userData.curScaleOffX) + scaleOffX;
							me._exit_vr_open.userData.curScaleOffX = scaleOffX;
							me._exit_vr_open.position.y = (me._exit_vr_open.position.y - me._exit_vr_open.userData.curScaleOffY) + scaleOffY;
							me._exit_vr_open.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._exit_vr_open.userData.transitions.splice(me._exit_vr_open.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._exit_vr_open.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._exit_vr_open.userData.onclick=function (e) {
			player.exitVR();
			player.setVRSkinVisibility("0");
		}
		me._exit_vr_open.userData.hasOwnClickAction = true;
		me._exit_vr_open.userData.onmouseenter=function (e) {
			me.elementMouseOver['exit_vr_open']=true;
			me._exit_vr_open.logicBlock_scaling();
		}
		me._exit_vr_open.userData.ontouchend=function (e) {
			me._exit_vr_open.logicBlock_scaling();
		}
		me._exit_vr_open.userData.onmouseleave=function (e) {
			me.elementMouseOver['exit_vr_open']=false;
			me._exit_vr_open.logicBlock_scaling();
		}
		me._exit_vr_open.userData.ggUpdatePosition=function (useTransition) {
		}
		me.__open_skin.add(me._exit_vr_open);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._open_skin.userData.svgGroupNormal) me._open_skin.userData.setOpacityInState(me._open_skin.userData.svgGroupNormal, v);
			if (me._open_skin.userData.svgGroupOver) me._open_skin.userData.setOpacityInState(me._open_skin.userData.svgGroupOver, v);
			if (me._open_skin.userData.svgGroupActive) me._open_skin.userData.setOpacityInState(me._open_skin.userData.svgGroupActive, v);
			me._open_skin.visible = (v>0 && me._open_skin.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'open_skin';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.050);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.050;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 5;
		el.userData.renderOrder = 5;
		el.userData.isVisible = function() {
			let vis = me._open_skin.visible
			let parentEl = me._open_skin.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._open_skin.userData.opacity = v;
			v = v * me._open_skin.userData.parentOpacity;
			if (me._open_skin.userData.setOpacityInternal) me._open_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me._open_skin.children.length; i++) {
				let child = me._open_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._open_skin.userData.parentOpacity = v;
			v = v * me._open_skin.userData.opacity
			if (me._open_skin.userData.setOpacityInternal) me._open_skin.userData.setOpacityInternal(v);
			for (let i = 0; i < me._open_skin.children.length; i++) {
				let child = me._open_skin.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._open_skin = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'open_skin_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'open_skin_clickTargetMaterial';
		me._open_skin.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._open_skin.userData.clickTarget.name = 'open_skin_clickTarget';
		me._open_skin.userData.clickTarget.userData.clickInvisible = true;
		me._open_skin.userData.clickTarget.visible = false;
		me._open_skin.add(me._open_skin.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/open_skin.svg', me._open_skin.userData.width / 100.0, me._open_skin.userData.height / 100.0);
			me._open_skin.add(group);
			me._open_skin.userData.svgGroupNormal = group;
			me._open_skin.userData.setOpacityInState(group, me._open_skin.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="open_skin";
		me._open_skin.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._open_skin.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['open_skin'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._open_skin.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._open_skin.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._open_skin.ggCurrentLogicStateScaling == 0) {
					me._open_skin.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._open_skin.userData.transitions.length; i++) {
						if (me._open_skin.userData.transitions[i].property == 'scale') {
							clearInterval(me._open_skin.userData.transitions[i].interval);
							me._open_skin.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._open_skin.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._open_skin.scale.set(transition_scale.startScale.x + (me._open_skin.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._open_skin.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._open_skin.position.x = (me._open_skin.position.x - me._open_skin.userData.curScaleOffX) + scaleOffX;
							me._open_skin.userData.curScaleOffX = scaleOffX;
							me._open_skin.position.y = (me._open_skin.position.y - me._open_skin.userData.curScaleOffY) + scaleOffY;
							me._open_skin.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._open_skin.userData.transitions.splice(me._open_skin.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._open_skin.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._open_skin.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._open_skin.userData.transitions.length; i++) {
						if (me._open_skin.userData.transitions[i].property == 'scale') {
							clearInterval(me._open_skin.userData.transitions[i].interval);
							me._open_skin.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._open_skin.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._open_skin.scale.set(transition_scale.startScale.x + (me._open_skin.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._open_skin.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._open_skin.position.x = (me._open_skin.position.x - me._open_skin.userData.curScaleOffX) + scaleOffX;
							me._open_skin.userData.curScaleOffX = scaleOffX;
							me._open_skin.position.y = (me._open_skin.position.y - me._open_skin.userData.curScaleOffY) + scaleOffY;
							me._open_skin.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._open_skin.userData.transitions.splice(me._open_skin.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._open_skin.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._open_skin.userData.onclick=function (e) {
			player.setVRSkinVisibility("1");
		}
		me._open_skin.userData.hasOwnClickAction = true;
		me._open_skin.userData.onmouseenter=function (e) {
			me.elementMouseOver['open_skin']=true;
			me._open_skin.logicBlock_scaling();
		}
		me._open_skin.userData.ontouchend=function (e) {
			me._open_skin.logicBlock_scaling();
		}
		me._open_skin.userData.onmouseleave=function (e) {
			me.elementMouseOver['open_skin']=false;
			me._open_skin.logicBlock_scaling();
		}
		me._open_skin.userData.ggUpdatePosition=function (useTransition) {
		}
		me.__open_skin.add(me._open_skin);
		me.player.setVRShowSkinButton(me.__open_skin);
		me._thumbnails.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._thumbnails.traverse((obj)=>{
				if (me._thumbnails.material) {
					me._thumbnails.material.transparent = (me._thumbnails.userData.zIndexCurrent > 0);
					}
			});
		}
		me._thumbnails.logicBlock_visible();
		me._node_cloner_vr.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._node_cloner_vr.traverse((obj)=>{
				if (me._node_cloner_vr.material) {
					me._node_cloner_vr.material.transparent = (me._node_cloner_vr.userData.zIndexCurrent > 0);
					}
			});
		}
		me._node_cloner_vr.userData.ggUpdate();
		me._page_up.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._page_up.traverse((obj)=>{
				if (me._page_up.material) {
					me._page_up.material.transparent = (me._page_up.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['page_up']=false;
		me._page_up.logicBlock_position();
		me._page_up.logicBlock_scaling();
		me._page_up.logicBlock_visible();
		me._page_down.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._page_down.traverse((obj)=>{
				if (me._page_down.material) {
					me._page_down.material.transparent = (me._page_down.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['page_down']=false;
		me._page_down.logicBlock_scaling();
		me._page_down.logicBlock_visible();
		if (player.get3dModelType() == 2) {
			me.__close_skin.traverse((obj)=>{
				if (me.__close_skin.material) {
					me.__close_skin.material.transparent = (me.__close_skin.userData.zIndexCurrent > 0);
					}
			});
		}
		me._exit_vr_close.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._exit_vr_close.traverse((obj)=>{
				if (me._exit_vr_close.material) {
					me._exit_vr_close.material.transparent = (me._exit_vr_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['exit_vr_close']=false;
		me._exit_vr_close.logicBlock_scaling();
		me._close_skin.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._close_skin.traverse((obj)=>{
				if (me._close_skin.material) {
					me._close_skin.material.transparent = (me._close_skin.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['close_skin']=false;
		me._close_skin.logicBlock_scaling();
		if (player.get3dModelType() == 2) {
			me.__open_skin.traverse((obj)=>{
				if (me.__open_skin.material) {
					me.__open_skin.material.transparent = (me.__open_skin.userData.zIndexCurrent > 0);
					}
			});
		}
		me._exit_vr_open.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._exit_vr_open.traverse((obj)=>{
				if (me._exit_vr_open.material) {
					me._exit_vr_open.material.transparent = (me._exit_vr_open.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['exit_vr_open']=false;
		me._exit_vr_open.logicBlock_scaling();
		me._open_skin.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._open_skin.traverse((obj)=>{
				if (me._open_skin.material) {
					me._open_skin.material.transparent = (me._open_skin.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['open_skin']=false;
		me._open_skin.logicBlock_scaling();
		me.eventactivehotspotchangedCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_node__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_node__3d'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_file__3d'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_url__3d'][i].ggEvent_activehotspotchanged();
				}
			}
		};
		player.addListener('activehotspotchanged', me.eventactivehotspotchangedCallback);
		me.eventchangenodeCallback = function() {
			for(var i = 0; i < me._node_cloner_vr.userData.ggInstances.length; i++) {
				me._node_cloner_vr.userData.ggInstances[i].ggEvent_changenode();
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_vimeo__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_vimeo__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_vimeo__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_youtube__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_youtube__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_youtube__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_pdf__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_pdf__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_pdf__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_node__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_node__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_file__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_url__3d'][i].ggEvent_changenode();
				}
			}
			me.skin_nodechangeCallback();
			if (player.get3dModelType() == 2) {
				me._thumbnails.traverse((obj)=>{
					if (me._thumbnails.material) {
						me._thumbnails.material.transparent = (me._thumbnails.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._node_cloner_vr.traverse((obj)=>{
					if (me._node_cloner_vr.material) {
						me._node_cloner_vr.material.transparent = (me._node_cloner_vr.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._page_up.traverse((obj)=>{
					if (me._page_up.material) {
						me._page_up.material.transparent = (me._page_up.userData.zIndexCurrent > 0);
						}
				});
			}
			me._page_up.logicBlock_position();
			me._page_up.logicBlock_visible();
			if (player.get3dModelType() == 2) {
				me._page_down.traverse((obj)=>{
					if (me._page_down.material) {
						me._page_down.material.transparent = (me._page_down.userData.zIndexCurrent > 0);
						}
				});
			}
			me._page_down.logicBlock_visible();
			if (player.get3dModelType() == 2) {
				me.__close_skin.traverse((obj)=>{
					if (me.__close_skin.material) {
						me.__close_skin.material.transparent = (me.__close_skin.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._exit_vr_close.traverse((obj)=>{
					if (me._exit_vr_close.material) {
						me._exit_vr_close.material.transparent = (me._exit_vr_close.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._close_skin.traverse((obj)=>{
					if (me._close_skin.material) {
						me._close_skin.material.transparent = (me._close_skin.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me.__open_skin.traverse((obj)=>{
					if (me.__open_skin.material) {
						me.__open_skin.material.transparent = (me.__open_skin.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._exit_vr_open.traverse((obj)=>{
					if (me._exit_vr_open.material) {
						me._exit_vr_open.material.transparent = (me._exit_vr_open.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._open_skin.traverse((obj)=>{
					if (me._open_skin.material) {
						me._open_skin.material.transparent = (me._open_skin.userData.zIndexCurrent > 0);
						}
				});
			}
		};
		player.addListener('changenode', me.eventchangenodeCallback);
		me.eventconfigloadedCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_node__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_node__3d'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_file__3d'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_url__3d'][i].ggEvent_configloaded();
				}
			}
			me._thumbnails.logicBlock_visible();
			me._page_up.logicBlock_position();
			me._page_up.logicBlock_visible();
			me._page_down.logicBlock_visible();
		};
		player.addListener('configloaded', me.eventconfigloadedCallback);
		me.eventvarchanged_node_cloner_vr_hasDownCallback = function() {
			me._page_up.logicBlock_position();
			me._page_down.logicBlock_visible();
		};
		player.addListener('varchanged_node_cloner_vr_hasDown', me.eventvarchanged_node_cloner_vr_hasDownCallback);
		me.eventvarchanged_node_cloner_vr_hasUpCallback = function() {
			me._page_up.logicBlock_visible();
		};
		player.addListener('varchanged_node_cloner_vr_hasUp', me.eventvarchanged_node_cloner_vr_hasUpCallback);
		me.eventvarchanged_vis_image_hotspotsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_varchanged_vis_image_hotspots();
				}
			}
		};
		player.addListener('varchanged_vis_image_hotspots', me.eventvarchanged_vis_image_hotspotsCallback);
		me.eventvarchanged_vis_info_hotspotsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_varchanged_vis_info_hotspots();
				}
			}
		};
		player.addListener('varchanged_vis_info_hotspots', me.eventvarchanged_vis_info_hotspotsCallback);
		me.eventvarchanged_vis_video_file_hotspotsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_file__3d'][i].ggEvent_varchanged_vis_video_file_hotspots();
				}
			}
		};
		player.addListener('varchanged_vis_video_file_hotspots', me.eventvarchanged_vis_video_file_hotspotsCallback);
		me.eventvarchanged_vis_video_url_hotspotsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_url__3d'][i].ggEvent_varchanged_vis_video_url_hotspots();
				}
			}
		};
		player.addListener('varchanged_vis_video_url_hotspots', me.eventvarchanged_vis_video_url_hotspotsCallback);
	};
	this.removeSkin=function() {
	};
	function SkinHotspotClass_ht_video_url__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_url.visible = (v>0 && me._ht_video_url.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_video_url';
		el.userData.x = -2;
		el.userData.y = 1;
		el.translateZ(0.000);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.000;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 0;
		el.userData.renderOrder = 0;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url.visible
			let parentEl = me._ht_video_url.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url.userData.opacity = v;
			v = v * me._ht_video_url.userData.parentOpacity;
			if (me._ht_video_url.userData.setOpacityInternal) me._ht_video_url.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url.children.length; i++) {
				let child = me._ht_video_url.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url.userData.parentOpacity = v;
			v = v * me._ht_video_url.userData.opacity
			if (me._ht_video_url.userData.setOpacityInternal) me._ht_video_url.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url.children.length; i++) {
				let child = me._ht_video_url.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url = el;
		el.userData.ggId="ht_video_url";
		me._ht_video_url.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_video_url.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_video_url']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_url.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_url']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_video_url.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_icon.userData.svgGroupNormal) me._ht_video_url_icon.userData.setOpacityInState(me._ht_video_url_icon.userData.svgGroupNormal, v);
			if (me._ht_video_url_icon.userData.svgGroupOver) me._ht_video_url_icon.userData.setOpacityInState(me._ht_video_url_icon.userData.svgGroupOver, v);
			if (me._ht_video_url_icon.userData.svgGroupActive) me._ht_video_url_icon.userData.setOpacityInState(me._ht_video_url_icon.userData.svgGroupActive, v);
			me._ht_video_url_icon.visible = (v>0 && me._ht_video_url_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_icon.visible
			let parentEl = me._ht_video_url_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_icon.userData.opacity = v;
			v = v * me._ht_video_url_icon.userData.parentOpacity;
			if (me._ht_video_url_icon.userData.setOpacityInternal) me._ht_video_url_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_icon.children.length; i++) {
				let child = me._ht_video_url_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_icon.userData.parentOpacity = v;
			v = v * me._ht_video_url_icon.userData.opacity
			if (me._ht_video_url_icon.userData.setOpacityInternal) me._ht_video_url_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_icon.children.length; i++) {
				let child = me._ht_video_url_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_video_url_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_video_url_icon_clickTargetMaterial';
		me._ht_video_url_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_video_url_icon.userData.clickTarget.name = 'ht_video_url_icon_clickTarget';
		me._ht_video_url_icon.userData.clickTarget.userData.clickInvisible = true;
		me._ht_video_url_icon.userData.clickTarget.visible = false;
		me._ht_video_url_icon.add(me._ht_video_url_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_video_url_icon.svg', me._ht_video_url_icon.userData.width / 100.0, me._ht_video_url_icon.userData.height / 100.0);
			me._ht_video_url_icon.add(group);
			me._ht_video_url_icon.userData.svgGroupNormal = group;
			me._ht_video_url_icon.userData.setOpacityInState(group, me._ht_video_url_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_video_url_icon";
		me._ht_video_url_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_url_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_url_icon.userData.transitions.length; i++) {
						if (me._ht_video_url_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_icon.userData.transitions[i].interval);
							me._ht_video_url_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_icon.scale.set(transition_scale.startScale.x + (me._ht_video_url_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_icon.position.x = (me._ht_video_url_icon.position.x - me._ht_video_url_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_icon.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_icon.position.y = (me._ht_video_url_icon.position.y - me._ht_video_url_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_icon.userData.transitions.splice(me._ht_video_url_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_icon.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_url_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_icon.userData.transitions.length; i++) {
						if (me._ht_video_url_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_icon.userData.transitions[i].interval);
							me._ht_video_url_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_icon.scale.set(transition_scale.startScale.x + (me._ht_video_url_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_icon.position.x = (me._ht_video_url_icon.position.x - me._ht_video_url_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_icon.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_icon.position.y = (me._ht_video_url_icon.position.y - me._ht_video_url_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_icon.userData.transitions.splice(me._ht_video_url_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_icon.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_url_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_url_hotspots') !== null) && (player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1)) || 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_icon.visible=false;
			player.repaint();
			me._ht_video_url_icon.userData.visible=false;
				}
				else {
			me._ht_video_url_icon.visible=((!me._ht_video_url_icon.material && Number(me._ht_video_url_icon.userData.opacity>0)) || (me._ht_video_url_icon.material && Number(me._ht_video_url_icon.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_icon.userData.visible=true;
				}
			}
		}
		me._ht_video_url_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_video_url_hotspots', player.getVariableValue('vis_video_url_hotspots') + "<"+me.hotspot.id+">");
			me._ht_video_url_video.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_url_icon.userData.hasOwnClickAction = true;
		me._ht_video_url_icon.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_video_url_icon']=true;
			me._ht_video_url_tooltip.logicBlock_visible();
			me._ht_video_url_icon.logicBlock_scaling();
		}
		me._ht_video_url_icon.userData.ontouchend=function (e) {
			me._ht_video_url_icon.logicBlock_scaling();
		}
		me._ht_video_url_icon.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_url_icon']=false;
			me._ht_video_url_tooltip.logicBlock_visible();
			me._ht_video_url_icon.logicBlock_scaling();
		}
		me._ht_video_url_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_url_tooltip_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.415);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.415;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_tooltip.visible
			let parentEl = me._ht_video_url_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_tooltip.userData.opacity = v;
			v = v * me._ht_video_url_tooltip.userData.parentOpacity;
			if (me._ht_video_url_tooltip.userData.setOpacityInternal) me._ht_video_url_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_tooltip.children.length; i++) {
				let child = me._ht_video_url_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_tooltip.userData.parentOpacity = v;
			v = v * me._ht_video_url_tooltip.userData.opacity
			if (me._ht_video_url_tooltip.userData.setOpacityInternal) me._ht_video_url_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_tooltip.children.length; i++) {
				let child = me._ht_video_url_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_tooltip = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_url_tooltip;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_url_tooltip);
			if (skin.rectHasRoundedCorners(me._ht_video_url_tooltip)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_url_tooltip.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_url_tooltip.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_url_tooltip.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_url_tooltip.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_video_url_tooltip_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_video_url_tooltip_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_url_tooltip.userData.backgroundColorAlpha = 0.784314;
		me._ht_video_url_tooltip.userData.borderColorAlpha = 1;
		me._ht_video_url_tooltip.userData.setOpacityInternal = function(v) {
			me._ht_video_url_tooltip.material.opacity = v;
			if (me._ht_video_url_tooltip.userData.hasScrollbar) {
				me._ht_video_url_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_video_url_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_url_tooltip.userData.ggSubElement) {
				me._ht_video_url_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_video_url_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_video_url_tooltip.userData.visible);
			}
			me._ht_video_url_tooltip.visible = (v>0 && me._ht_video_url_tooltip.userData.visible);
		}
		me._ht_video_url_tooltip.userData.setBackgroundColor = function(v) {
			me._ht_video_url_tooltip.material.color = v;
		}
		me._ht_video_url_tooltip.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_tooltip.userData.backgroundColorAlpha = v;
			me._ht_video_url_tooltip.userData.setOpacity(me._ht_video_url_tooltip.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 44;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_video_url_tooltip;
			var canv = me._ht_video_url_tooltip.userData.textCanvas;
			var ctx = me._ht_video_url_tooltip.userData.textCanvasContext;
			var tmpCanv = me._ht_video_url_tooltip.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_url_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_video_url_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_video_url_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_video_url_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_video_url_tooltip.userData.scrollPosPercent ? tmpCanv.height * me._ht_video_url_tooltip.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_video_url_tooltip.userData.boxWidthCanv / 100.0;
		height = me._ht_video_url_tooltip.userData.boxHeightCanv / 100.0;
		me._ht_video_url_tooltip.userData.width = me._ht_video_url_tooltip.userData.boxWidthCanv;
		me._ht_video_url_tooltip.userData.height = me._ht_video_url_tooltip.userData.boxHeightCanv;
		me._ht_video_url_tooltip.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_video_url_tooltip, 0, -30);
		me._ht_video_url_tooltip.position.x = newPos.x;
		me._ht_video_url_tooltip.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_url_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_url_tooltip.material.map) {
				me._ht_video_url_tooltip.material.map.dispose();
			}
			me._ht_video_url_tooltip.material.map = textTexture;
			me._ht_video_url_tooltip.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_video_url_tooltip, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_video_url_tooltip, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: center; white-space: pre; padding: 5px; overflow: hidden;' + '; color: ' + me._ht_video_url_tooltip.userData.textColor + ' !important;', false, true, false);
			me._ht_video_url_tooltip.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_url_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_url_tooltip.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_url_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_url_tooltip";
		me._ht_video_url_tooltip.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_video_url_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_tooltip.visible=((!me._ht_video_url_tooltip.material && Number(me._ht_video_url_tooltip.userData.opacity>0)) || (me._ht_video_url_tooltip.material && Number(me._ht_video_url_tooltip.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_tooltip.userData.visible=true;
				}
				else {
			me._ht_video_url_tooltip.visible=false;
			player.repaint();
			me._ht_video_url_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_video_url_tooltip.userData.ggUpdatePosition=function (useTransition) {
				me._ht_video_url_tooltip.userData.ggUpdateText(true);
		}
		me._ht_video_url_icon.add(me._ht_video_url_tooltip);
		me._ht_video_url.add(me._ht_video_url_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#00aaff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_url_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(1.188);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 240;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.188;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_bg.visible
			let parentEl = me._ht_video_url_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_bg.userData.opacity = v;
			v = v * me._ht_video_url_bg.userData.parentOpacity;
			if (me._ht_video_url_bg.userData.setOpacityInternal) me._ht_video_url_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_bg.children.length; i++) {
				let child = me._ht_video_url_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_bg.userData.parentOpacity = v;
			v = v * me._ht_video_url_bg.userData.opacity
			if (me._ht_video_url_bg.userData.setOpacityInternal) me._ht_video_url_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_bg.children.length; i++) {
				let child = me._ht_video_url_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_url_bg;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_url_bg);
			if (skin.rectHasRoundedCorners(me._ht_video_url_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_url_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_url_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_url_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_url_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_video_url_bg_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_video_url_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_url_bg.userData.backgroundColorAlpha = 0.784314;
		me._ht_video_url_bg.userData.borderColorAlpha = 1;
		me._ht_video_url_bg.userData.setOpacityInternal = function(v) {
			me._ht_video_url_bg.material.opacity = v * me._ht_video_url_bg.userData.backgroundColorAlpha;
			if (me._ht_video_url_bg.userData.ggSubElement) {
				me._ht_video_url_bg.userData.ggSubElement.material.opacity = v
				me._ht_video_url_bg.userData.ggSubElement.visible = (v>0 && me._ht_video_url_bg.userData.visible);
			}
			me._ht_video_url_bg.visible = (v>0 && me._ht_video_url_bg.userData.visible);
		}
		me._ht_video_url_bg.userData.setBackgroundColor = function(v) {
			me._ht_video_url_bg.material.color = v;
		}
		me._ht_video_url_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_bg.userData.backgroundColorAlpha = v;
			me._ht_video_url_bg.userData.setOpacity(me._ht_video_url_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.ggId="ht_video_url_bg";
		me._ht_video_url_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_video_url_hotspots') !== null) && (player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_bg.scale.set(transition_scale.startScale.x + (me._ht_video_url_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_bg.position.x = (me._ht_video_url_bg.position.x - me._ht_video_url_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_bg.position.y = (me._ht_video_url_bg.position.y - me._ht_video_url_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_url_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_bg.scale.set(transition_scale.startScale.x + (me._ht_video_url_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_bg.position.x = (me._ht_video_url_bg.position.x - me._ht_video_url_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_bg.position.y = (me._ht_video_url_bg.position.y - me._ht_video_url_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_url_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_url_hotspots') !== null) && (player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_bg.material ? me._ht_video_url_bg.material.opacity : me._ht_video_url_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_url_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_bg.userData.transitions[i].interval);
							me._ht_video_url_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_bg.material ? me._ht_video_url_bg.material.opacity : me._ht_video_url_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_bg.userData.transitions.splice(me._ht_video_url_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_url_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneGeometry(3.4, 2.2, 5, 5 );
		geometry.name = 'ht_video_url_video_geometry';
		material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_url_video_material';
		el = new THREE.Mesh( geometry, material );
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 220;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_video';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_video.material) me._ht_video_url_video.material.opacity = v;
			me._ht_video_url_video.visible = (v>0 && me._ht_video_url_video.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_video.visible
			let parentEl = me._ht_video_url_video.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_video.userData.opacity = v;
			v = v * me._ht_video_url_video.userData.parentOpacity;
			if (me._ht_video_url_video.userData.setOpacityInternal) me._ht_video_url_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_video.children.length; i++) {
				let child = me._ht_video_url_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_video.userData.parentOpacity = v;
			v = v * me._ht_video_url_video.userData.opacity
			if (me._ht_video_url_video.userData.setOpacityInternal) me._ht_video_url_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_video.children.length; i++) {
				let child = me._ht_video_url_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_video = el;
		me._ht_video_url_video.userData.seekbars = [];
		me._ht_video_url_video.userData.ggInitMedia = function(media) {
			if (me._ht_video_url_video__vid) me._ht_video_url_video__vid.pause();
			me._ht_video_url_video__vid = document.createElement('video');
			player.registerVideoElement('ht_video_url_video', me._ht_video_url_video__vid);
			me._ht_video_url_video__vid.setAttribute('autoplay', '');
			me._ht_video_url_video__vid.setAttribute('crossOrigin', 'anonymous');
			me._ht_video_url_video__source = document.createElement('source');
			me._ht_video_url_video__source.setAttribute('src', media);
			me._ht_video_url_video__vid.addEventListener('loadedmetadata', function() {
				let videoAR = me._ht_video_url_video__vid.videoWidth / me._ht_video_url_video__vid.videoHeight;
				let elAR = me._ht_video_url_video.userData.width / me._ht_video_url_video.userData.height;
				if (videoAR > elAR) {
					me._ht_video_url_video.scale.set(1, (me._ht_video_url_video.userData.width / videoAR) / me._ht_video_url_video.userData.height, 1);
				} else {
					me._ht_video_url_video.scale.set((me._ht_video_url_video.userData.height * videoAR) / me._ht_video_url_video.userData.width, 1, 1);
				}
			}, false);
			me._ht_video_url_video__vid.appendChild(me._ht_video_url_video__source);
			videoTexture = new THREE.VideoTexture( me._ht_video_url_video__vid );
			videoTexture.name = 'ht_video_url_video_videoTexture';
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, transparent: true} );
			videoMaterial.name = 'ht_video_url_video_videoMaterial';
			videoMaterial.alphaTest = 0.5;
			me._ht_video_url_video.material = videoMaterial;
		}
		el.userData.ggId="ht_video_url_video";
		me._ht_video_url_video.userData.ggIsActive=function() {
			if (me._ht_video_url_video__vid != null) {
				return (me._ht_video_url_video__vid.paused == false && me._ht_video_url_video__vid.ended == false);
			} else {
				return false;
			}
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_video.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_url_hotspots') !== null) && (player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_video.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_video.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_video.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_video.visible=((!me._ht_video_url_video.material && Number(me._ht_video_url_video.userData.opacity>0)) || (me._ht_video_url_video.material && Number(me._ht_video_url_video.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_video.userData.visible=true;
					if (me._ht_video_url_video.userData.ggVideoNotLoaded) {
						me._ht_video_url_video.userData.ggInitMedia(me._ht_video_url_video.ggVideoSource);
					}
				}
				else {
			me._ht_video_url_video.visible=false;
			player.repaint();
			me._ht_video_url_video.userData.visible=false;
					me._ht_video_url_video.userData.ggInitMedia('');
				}
			}
		}
		me._ht_video_url_video.userData.onclick=function (e) {
			if (me._ht_video_url_video.ggApiPlayer) {
				if (me._ht_video_url_video.ggApiPlayerType == 'youtube') {
					let youtubeMediaFunction = function() {
						if (me._ht_video_url_video.ggApiPlayer.getPlayerState() == 1) {
							me._ht_video_url_video.ggApiPlayer.pauseVideo();
						} else {
							me._ht_video_url_video.ggApiPlayer.playVideo();
						}
					};
					if (me._ht_video_url_video.ggApiPlayerReady) {
						youtubeMediaFunction();
					} else {
						let youtubeApiInterval = setInterval(function() {
							if (me._ht_video_url_video.ggApiPlayerReady) {
								clearInterval(youtubeApiInterval);
								youtubeMediaFunction();
							}
						}, 100);
					}
				} else if (me._ht_video_url_video.ggApiPlayerType == 'vimeo') {
					var promise = me._ht_video_url_video.ggApiPlayer.getPaused();
					promise.then(function(result) {
						if (result == true) {
							me._ht_video_url_video.ggApiPlayer.play();
						} else {
							me._ht_video_url_video.ggApiPlayer.pause();
						}
					});
				}
			} else {
				player.playPauseSound("ht_video_url_video","1");
			}
		}
		me._ht_video_url_video.userData.hasOwnClickAction = true;
		me._ht_video_url_video.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url_bg.add(me._ht_video_url_video);
		me._ht_video_url.add(me._ht_video_url_bg);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_close.userData.svgGroupNormal) me._ht_video_url_close.userData.setOpacityInState(me._ht_video_url_close.userData.svgGroupNormal, v);
			if (me._ht_video_url_close.userData.svgGroupOver) me._ht_video_url_close.userData.setOpacityInState(me._ht_video_url_close.userData.svgGroupOver, v);
			if (me._ht_video_url_close.userData.svgGroupActive) me._ht_video_url_close.userData.setOpacityInState(me._ht_video_url_close.userData.svgGroupActive, v);
			me._ht_video_url_close.visible = (v>0 && me._ht_video_url_close.userData.visible);
		}
		el.translateX(2.1);
		el.translateY(0.975);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_close';
		el.userData.x = 2.1;
		el.userData.y = 0.975;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_close.visible
			let parentEl = me._ht_video_url_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_close.userData.opacity = v;
			v = v * me._ht_video_url_close.userData.parentOpacity;
			if (me._ht_video_url_close.userData.setOpacityInternal) me._ht_video_url_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_close.children.length; i++) {
				let child = me._ht_video_url_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_close.userData.parentOpacity = v;
			v = v * me._ht_video_url_close.userData.opacity
			if (me._ht_video_url_close.userData.setOpacityInternal) me._ht_video_url_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_close.children.length; i++) {
				let child = me._ht_video_url_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_video_url_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_video_url_close_clickTargetMaterial';
		me._ht_video_url_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_video_url_close.userData.clickTarget.name = 'ht_video_url_close_clickTarget';
		me._ht_video_url_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_video_url_close.userData.clickTarget.visible = false;
		me._ht_video_url_close.add(me._ht_video_url_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_video_url_close.svg', me._ht_video_url_close.userData.width / 100.0, me._ht_video_url_close.userData.height / 100.0);
			me._ht_video_url_close.add(group);
			me._ht_video_url_close.userData.svgGroupNormal = group;
			me._ht_video_url_close.userData.setOpacityInState(group, me._ht_video_url_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_video_url_close";
		me._ht_video_url_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_url_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_close.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_close.scale.set(transition_scale.startScale.x + (me._ht_video_url_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_close.position.x = (me._ht_video_url_close.position.x - me._ht_video_url_close.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_close.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_close.position.y = (me._ht_video_url_close.position.y - me._ht_video_url_close.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_close.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_url_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_close.scale.set(transition_scale.startScale.x + (me._ht_video_url_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_close.position.x = (me._ht_video_url_close.position.x - me._ht_video_url_close.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_close.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_close.position.y = (me._ht_video_url_close.position.y - me._ht_video_url_close.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_close.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_url_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_url_hotspots') !== null) && (player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_close.material ? me._ht_video_url_close.material.opacity : me._ht_video_url_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_close.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_url_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_close.userData.transitions.length; i++) {
						if (me._ht_video_url_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_close.userData.transitions[i].interval);
							me._ht_video_url_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_close.material ? me._ht_video_url_close.material.opacity : me._ht_video_url_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_close.userData.transitions.splice(me._ht_video_url_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_close.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_url_close.userData.onclick=function (e) {
			player.setVariableValue('vis_video_url_hotspots', player.getVariableValue('vis_video_url_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_video_url_close.userData.hasOwnClickAction = true;
		me._ht_video_url_close.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_video_url_close']=true;
			me._ht_video_url_close.logicBlock_scaling();
		}
		me._ht_video_url_close.userData.ontouchend=function (e) {
			me._ht_video_url_close.logicBlock_scaling();
		}
		me._ht_video_url_close.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_url_close']=false;
			me._ht_video_url_close.logicBlock_scaling();
		}
		me._ht_video_url_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url.add(me._ht_video_url_close);
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 50;
		el.userData.height = 50;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_CustomImage';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_customimage.visible
			let parentEl = me._ht_video_url_customimage.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_url_customimage.userData.opacity = v;
			v = v * me._ht_video_url_customimage.userData.parentOpacity;
			if (me._ht_video_url_customimage.userData.setOpacityInternal) me._ht_video_url_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_customimage.children.length; i++) {
				let child = me._ht_video_url_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_customimage.userData.parentOpacity = v;
			v = v * me._ht_video_url_customimage.userData.opacity
			if (me._ht_video_url_customimage.userData.setOpacityInternal) me._ht_video_url_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_customimage.children.length; i++) {
				let child = me._ht_video_url_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_customimage = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_url_customimage;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_url_customimage);
		}
		me._ht_video_url_customimage.userData.backgroundColorAlpha = 1;
		me._ht_video_url_customimage.userData.borderColorAlpha = 1;
		me._ht_video_url_customimage.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_customimage.userData.ggSubElement) {
				me._ht_video_url_customimage.userData.ggSubElement.material.opacity = v
				me._ht_video_url_customimage.userData.ggSubElement.visible = (v>0 && me._ht_video_url_customimage.userData.visible);
			}
			me._ht_video_url_customimage.visible = (v>0 && me._ht_video_url_customimage.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 50;
		currentHeight = 50;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'ht_video_url_CustomImage_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_video_url_customimage.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_video_url_customimage.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_video_url_CustomImage_subElementMaterial';
				me._ht_video_url_customimage.userData.ggSubElement.material = loadedMaterial;
				me._ht_video_url_customimage.userData.ggUpdatePosition();
				me._ht_video_url_customimage.userData.ggText = extUrl;
				me._ht_video_url_customimage.userData.setOpacity(me._ht_video_url_customimage.userData.opacity);
			});
		};
		if ((hotspot) && (hotspot.customimage)) {
			var extUrl=hotspot.customimage;
		}
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_video_url_CustomImage_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_video_url_CustomImage_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 50;
		el.userData.clientHeight = 50;
		el.userData.ggId="ht_video_url_CustomImage";
		me._ht_video_url_customimage.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_customimage.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_url_hotspots') !== null) && (player.getVariableValue('vis_video_url_hotspots')).indexOf("<"+me.hotspot.id+">") == -1)) && 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_customimage.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_customimage.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_customimage.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_customimage.visible=((!me._ht_video_url_customimage.material && Number(me._ht_video_url_customimage.userData.opacity>0)) || (me._ht_video_url_customimage.material && Number(me._ht_video_url_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_customimage.userData.visible=true;
				}
				else {
			me._ht_video_url_customimage.visible=false;
			player.repaint();
			me._ht_video_url_customimage.userData.visible=false;
				}
			}
		}
		me._ht_video_url_customimage.userData.onclick=function (e) {
			player.setVariableValue('vis_video_url_hotspots', player.getVariableValue('vis_video_url_hotspots') + "<"+me.hotspot.id+">");
			me._ht_video_url_video.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_url_customimage.userData.hasOwnClickAction = true;
		me._ht_video_url_customimage.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_video_url_customimage.userData.clientWidth;
			var parentHeight = me._ht_video_url_customimage.userData.clientHeight;
			var img = me._ht_video_url_customimage.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if ((hotspot) && (hotspot.customimage)) {
				currentWidth  = hotspot.customimagewidth;
				currentHeight = hotspot.customimageheight;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_video_url_CustomImage_imgGeometry';
			}
		}
		me._ht_video_url.add(me._ht_video_url_customimage);
		me._ht_video_url.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url.traverse((obj)=>{
				if (me._ht_video_url.material) {
					me._ht_video_url.material.transparent = (me._ht_video_url.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_url']=false;
		me._ht_video_url_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_icon.traverse((obj)=>{
				if (me._ht_video_url_icon.material) {
					me._ht_video_url_icon.material.transparent = (me._ht_video_url_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_url_icon']=false;
		me._ht_video_url_icon.logicBlock_scaling();
		me._ht_video_url_icon.logicBlock_visible();
		me._ht_video_url_tooltip.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_tooltip.traverse((obj)=>{
				if (me._ht_video_url_tooltip.material) {
					me._ht_video_url_tooltip.material.transparent = (me._ht_video_url_tooltip.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_video_url_tooltip.userData.ggUpdateText(true);
		me._ht_video_url_tooltip.logicBlock_visible();
		me._ht_video_url_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_bg.traverse((obj)=>{
				if (me._ht_video_url_bg.material) {
					me._ht_video_url_bg.material.transparent = (me._ht_video_url_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_url_bg.logicBlock_scaling();
		me._ht_video_url_bg.logicBlock_alpha();
		me._ht_video_url_video.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_video.traverse((obj)=>{
				if (me._ht_video_url_video.material) {
					me._ht_video_url_video.material.transparent = (me._ht_video_url_video.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_url_video.userData.ggVideoSource = '';
		me._ht_video_url_video.userData.ggVideoNotLoaded = true;
		me._ht_video_url_video.logicBlock_visible();
		me._ht_video_url_close.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_close.traverse((obj)=>{
				if (me._ht_video_url_close.material) {
					me._ht_video_url_close.material.transparent = (me._ht_video_url_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_url_close']=false;
		me._ht_video_url_close.logicBlock_scaling();
		me._ht_video_url_close.logicBlock_alpha();
		me._ht_video_url_customimage.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_customimage.traverse((obj)=>{
				if (me._ht_video_url_customimage.material) {
					me._ht_video_url_customimage.material.transparent = (me._ht_video_url_customimage.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_url_customimage.logicBlock_visible();
			me.ggEvent_activehotspotchanged=function() {
				me._ht_video_url_icon.logicBlock_visible();
				me._ht_video_url_tooltip.logicBlock_visible();
				me._ht_video_url_customimage.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_video_url.traverse((obj)=>{
						if (me._ht_video_url.material) {
							me._ht_video_url.material.transparent = (me._ht_video_url.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_video_url_icon.traverse((obj)=>{
						if (me._ht_video_url_icon.material) {
							me._ht_video_url_icon.material.transparent = (me._ht_video_url_icon.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_icon.logicBlock_visible();
					me._ht_video_url_tooltip.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_tooltip.traverse((obj)=>{
						if (me._ht_video_url_tooltip.material) {
							me._ht_video_url_tooltip.material.transparent = (me._ht_video_url_tooltip.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_tooltip.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_bg.traverse((obj)=>{
						if (me._ht_video_url_bg.material) {
							me._ht_video_url_bg.material.transparent = (me._ht_video_url_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_bg.logicBlock_scaling();
				me._ht_video_url_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_video.traverse((obj)=>{
						if (me._ht_video_url_video.material) {
							me._ht_video_url_video.material.transparent = (me._ht_video_url_video.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_video.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_close.traverse((obj)=>{
						if (me._ht_video_url_close.material) {
							me._ht_video_url_close.material.transparent = (me._ht_video_url_close.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_close.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_customimage.traverse((obj)=>{
						if (me._ht_video_url_customimage.material) {
							me._ht_video_url_customimage.material.transparent = (me._ht_video_url_customimage.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_customimage.logicBlock_visible();
			};
			me.ggEvent_configloaded=function() {
				me._ht_video_url_icon.logicBlock_visible();
				me._ht_video_url_tooltip.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_scaling();
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_video.logicBlock_visible();
				me._ht_video_url_close.logicBlock_alpha();
				me._ht_video_url_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_vis_video_url_hotspots=function() {
				me._ht_video_url_icon.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_scaling();
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_video.logicBlock_visible();
				me._ht_video_url_close.logicBlock_alpha();
				me._ht_video_url_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_video_url;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_video_file__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_file.visible = (v>0 && me._ht_video_file.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_video_file';
		el.userData.x = -2;
		el.userData.y = 1;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file.visible
			let parentEl = me._ht_video_file.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file.userData.opacity = v;
			v = v * me._ht_video_file.userData.parentOpacity;
			if (me._ht_video_file.userData.setOpacityInternal) me._ht_video_file.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file.children.length; i++) {
				let child = me._ht_video_file.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file.userData.parentOpacity = v;
			v = v * me._ht_video_file.userData.opacity
			if (me._ht_video_file.userData.setOpacityInternal) me._ht_video_file.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file.children.length; i++) {
				let child = me._ht_video_file.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file = el;
		el.userData.ggId="ht_video_file";
		me._ht_video_file.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_video_file.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_video_file']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_file.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_file']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_video_file.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_icon.userData.svgGroupNormal) me._ht_video_file_icon.userData.setOpacityInState(me._ht_video_file_icon.userData.svgGroupNormal, v);
			if (me._ht_video_file_icon.userData.svgGroupOver) me._ht_video_file_icon.userData.setOpacityInState(me._ht_video_file_icon.userData.svgGroupOver, v);
			if (me._ht_video_file_icon.userData.svgGroupActive) me._ht_video_file_icon.userData.setOpacityInState(me._ht_video_file_icon.userData.svgGroupActive, v);
			me._ht_video_file_icon.visible = (v>0 && me._ht_video_file_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_icon.visible
			let parentEl = me._ht_video_file_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_icon.userData.opacity = v;
			v = v * me._ht_video_file_icon.userData.parentOpacity;
			if (me._ht_video_file_icon.userData.setOpacityInternal) me._ht_video_file_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_icon.children.length; i++) {
				let child = me._ht_video_file_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_icon.userData.parentOpacity = v;
			v = v * me._ht_video_file_icon.userData.opacity
			if (me._ht_video_file_icon.userData.setOpacityInternal) me._ht_video_file_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_icon.children.length; i++) {
				let child = me._ht_video_file_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_video_file_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_video_file_icon_clickTargetMaterial';
		me._ht_video_file_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_video_file_icon.userData.clickTarget.name = 'ht_video_file_icon_clickTarget';
		me._ht_video_file_icon.userData.clickTarget.userData.clickInvisible = true;
		me._ht_video_file_icon.userData.clickTarget.visible = false;
		me._ht_video_file_icon.add(me._ht_video_file_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_video_file_icon.svg', me._ht_video_file_icon.userData.width / 100.0, me._ht_video_file_icon.userData.height / 100.0);
			me._ht_video_file_icon.add(group);
			me._ht_video_file_icon.userData.svgGroupNormal = group;
			me._ht_video_file_icon.userData.setOpacityInState(group, me._ht_video_file_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_video_file_icon";
		me._ht_video_file_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_file_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_file_icon.userData.transitions.length; i++) {
						if (me._ht_video_file_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_icon.userData.transitions[i].interval);
							me._ht_video_file_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_icon.scale.set(transition_scale.startScale.x + (me._ht_video_file_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_icon.position.x = (me._ht_video_file_icon.position.x - me._ht_video_file_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_icon.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_icon.position.y = (me._ht_video_file_icon.position.y - me._ht_video_file_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_icon.userData.transitions.splice(me._ht_video_file_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_icon.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_file_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_icon.userData.transitions.length; i++) {
						if (me._ht_video_file_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_icon.userData.transitions[i].interval);
							me._ht_video_file_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_icon.scale.set(transition_scale.startScale.x + (me._ht_video_file_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_icon.position.x = (me._ht_video_file_icon.position.x - me._ht_video_file_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_icon.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_icon.position.y = (me._ht_video_file_icon.position.y - me._ht_video_file_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_icon.userData.transitions.splice(me._ht_video_file_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_icon.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_file_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_file_hotspots') !== null) && (player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1)) || 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_icon.visible=false;
			player.repaint();
			me._ht_video_file_icon.userData.visible=false;
				}
				else {
			me._ht_video_file_icon.visible=((!me._ht_video_file_icon.material && Number(me._ht_video_file_icon.userData.opacity>0)) || (me._ht_video_file_icon.material && Number(me._ht_video_file_icon.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_icon.userData.visible=true;
				}
			}
		}
		me._ht_video_file_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_video_file_hotspots', player.getVariableValue('vis_video_file_hotspots') + "<"+me.hotspot.id+">");
			me._ht_video_file_video.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_file_icon.userData.hasOwnClickAction = true;
		me._ht_video_file_icon.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_video_file_icon']=true;
			me._ht_video_file_tooltip.logicBlock_visible();
			me._ht_video_file_icon.logicBlock_scaling();
		}
		me._ht_video_file_icon.userData.ontouchend=function (e) {
			me._ht_video_file_icon.logicBlock_scaling();
		}
		me._ht_video_file_icon.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_file_icon']=false;
			me._ht_video_file_tooltip.logicBlock_visible();
			me._ht_video_file_icon.logicBlock_scaling();
		}
		me._ht_video_file_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_file_tooltip_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.415);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.415;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_tooltip.visible
			let parentEl = me._ht_video_file_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_tooltip.userData.opacity = v;
			v = v * me._ht_video_file_tooltip.userData.parentOpacity;
			if (me._ht_video_file_tooltip.userData.setOpacityInternal) me._ht_video_file_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_tooltip.children.length; i++) {
				let child = me._ht_video_file_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_tooltip.userData.parentOpacity = v;
			v = v * me._ht_video_file_tooltip.userData.opacity
			if (me._ht_video_file_tooltip.userData.setOpacityInternal) me._ht_video_file_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_tooltip.children.length; i++) {
				let child = me._ht_video_file_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_tooltip = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_file_tooltip;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_file_tooltip);
			if (skin.rectHasRoundedCorners(me._ht_video_file_tooltip)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_file_tooltip.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_file_tooltip.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_file_tooltip.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_file_tooltip.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_video_file_tooltip_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_video_file_tooltip_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_file_tooltip.userData.backgroundColorAlpha = 0.784314;
		me._ht_video_file_tooltip.userData.borderColorAlpha = 1;
		me._ht_video_file_tooltip.userData.setOpacityInternal = function(v) {
			me._ht_video_file_tooltip.material.opacity = v;
			if (me._ht_video_file_tooltip.userData.hasScrollbar) {
				me._ht_video_file_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_video_file_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_file_tooltip.userData.ggSubElement) {
				me._ht_video_file_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_video_file_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_video_file_tooltip.userData.visible);
			}
			me._ht_video_file_tooltip.visible = (v>0 && me._ht_video_file_tooltip.userData.visible);
		}
		me._ht_video_file_tooltip.userData.setBackgroundColor = function(v) {
			me._ht_video_file_tooltip.material.color = v;
		}
		me._ht_video_file_tooltip.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_tooltip.userData.backgroundColorAlpha = v;
			me._ht_video_file_tooltip.userData.setOpacity(me._ht_video_file_tooltip.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 44;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_video_file_tooltip;
			var canv = me._ht_video_file_tooltip.userData.textCanvas;
			var ctx = me._ht_video_file_tooltip.userData.textCanvasContext;
			var tmpCanv = me._ht_video_file_tooltip.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_file_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_video_file_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_video_file_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_video_file_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_video_file_tooltip.userData.scrollPosPercent ? tmpCanv.height * me._ht_video_file_tooltip.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_video_file_tooltip.userData.boxWidthCanv / 100.0;
		height = me._ht_video_file_tooltip.userData.boxHeightCanv / 100.0;
		me._ht_video_file_tooltip.userData.width = me._ht_video_file_tooltip.userData.boxWidthCanv;
		me._ht_video_file_tooltip.userData.height = me._ht_video_file_tooltip.userData.boxHeightCanv;
		me._ht_video_file_tooltip.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_video_file_tooltip, 0, -30);
		me._ht_video_file_tooltip.position.x = newPos.x;
		me._ht_video_file_tooltip.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_file_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_file_tooltip.material.map) {
				me._ht_video_file_tooltip.material.map.dispose();
			}
			me._ht_video_file_tooltip.material.map = textTexture;
			me._ht_video_file_tooltip.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_video_file_tooltip, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_video_file_tooltip, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: center; white-space: pre; padding: 5px; overflow: hidden;' + '; color: ' + me._ht_video_file_tooltip.userData.textColor + ' !important;', false, true, false);
			me._ht_video_file_tooltip.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_video_file_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_file_tooltip.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_file_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_file_tooltip";
		me._ht_video_file_tooltip.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_video_file_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_tooltip.visible=((!me._ht_video_file_tooltip.material && Number(me._ht_video_file_tooltip.userData.opacity>0)) || (me._ht_video_file_tooltip.material && Number(me._ht_video_file_tooltip.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_tooltip.userData.visible=true;
				}
				else {
			me._ht_video_file_tooltip.visible=false;
			player.repaint();
			me._ht_video_file_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_video_file_tooltip.userData.ggUpdatePosition=function (useTransition) {
				me._ht_video_file_tooltip.userData.ggUpdateText(true);
		}
		me._ht_video_file_icon.add(me._ht_video_file_tooltip);
		me._ht_video_file.add(me._ht_video_file_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#00aaff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_file_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(1.188);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 240;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.188;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_bg.visible
			let parentEl = me._ht_video_file_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_bg.userData.opacity = v;
			v = v * me._ht_video_file_bg.userData.parentOpacity;
			if (me._ht_video_file_bg.userData.setOpacityInternal) me._ht_video_file_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_bg.children.length; i++) {
				let child = me._ht_video_file_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_bg.userData.parentOpacity = v;
			v = v * me._ht_video_file_bg.userData.opacity
			if (me._ht_video_file_bg.userData.setOpacityInternal) me._ht_video_file_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_bg.children.length; i++) {
				let child = me._ht_video_file_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_file_bg;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_file_bg);
			if (skin.rectHasRoundedCorners(me._ht_video_file_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_file_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_file_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_file_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_file_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_video_file_bg_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_video_file_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_file_bg.userData.backgroundColorAlpha = 0.784314;
		me._ht_video_file_bg.userData.borderColorAlpha = 1;
		me._ht_video_file_bg.userData.setOpacityInternal = function(v) {
			me._ht_video_file_bg.material.opacity = v * me._ht_video_file_bg.userData.backgroundColorAlpha;
			if (me._ht_video_file_bg.userData.ggSubElement) {
				me._ht_video_file_bg.userData.ggSubElement.material.opacity = v
				me._ht_video_file_bg.userData.ggSubElement.visible = (v>0 && me._ht_video_file_bg.userData.visible);
			}
			me._ht_video_file_bg.visible = (v>0 && me._ht_video_file_bg.userData.visible);
		}
		me._ht_video_file_bg.userData.setBackgroundColor = function(v) {
			me._ht_video_file_bg.material.color = v;
		}
		me._ht_video_file_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_bg.userData.backgroundColorAlpha = v;
			me._ht_video_file_bg.userData.setOpacity(me._ht_video_file_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.ggId="ht_video_file_bg";
		me._ht_video_file_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_video_file_hotspots') !== null) && (player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_bg.scale.set(transition_scale.startScale.x + (me._ht_video_file_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_bg.position.x = (me._ht_video_file_bg.position.x - me._ht_video_file_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_bg.position.y = (me._ht_video_file_bg.position.y - me._ht_video_file_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_file_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_bg.scale.set(transition_scale.startScale.x + (me._ht_video_file_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_bg.position.x = (me._ht_video_file_bg.position.x - me._ht_video_file_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_bg.position.y = (me._ht_video_file_bg.position.y - me._ht_video_file_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_file_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_file_hotspots') !== null) && (player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_bg.material ? me._ht_video_file_bg.material.opacity : me._ht_video_file_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_file_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_bg.userData.transitions[i].interval);
							me._ht_video_file_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_bg.material ? me._ht_video_file_bg.material.opacity : me._ht_video_file_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_bg.userData.transitions.splice(me._ht_video_file_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_file_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneGeometry(3.4, 2.2, 5, 5 );
		geometry.name = 'ht_video_file_video_geometry';
		material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_file_video_material';
		el = new THREE.Mesh( geometry, material );
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 220;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_video';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_video.material) me._ht_video_file_video.material.opacity = v;
			me._ht_video_file_video.visible = (v>0 && me._ht_video_file_video.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_video.visible
			let parentEl = me._ht_video_file_video.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_video.userData.opacity = v;
			v = v * me._ht_video_file_video.userData.parentOpacity;
			if (me._ht_video_file_video.userData.setOpacityInternal) me._ht_video_file_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_video.children.length; i++) {
				let child = me._ht_video_file_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_video.userData.parentOpacity = v;
			v = v * me._ht_video_file_video.userData.opacity
			if (me._ht_video_file_video.userData.setOpacityInternal) me._ht_video_file_video.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_video.children.length; i++) {
				let child = me._ht_video_file_video.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_video = el;
		me._ht_video_file_video.userData.seekbars = [];
		me._ht_video_file_video.userData.ggInitMedia = function(media) {
			if (me._ht_video_file_video__vid) me._ht_video_file_video__vid.pause();
			me._ht_video_file_video__vid = document.createElement('video');
			player.registerVideoElement('ht_video_file_video', me._ht_video_file_video__vid);
			me._ht_video_file_video__vid.setAttribute('autoplay', '');
			me._ht_video_file_video__vid.setAttribute('crossOrigin', 'anonymous');
			me._ht_video_file_video__source = document.createElement('source');
			me._ht_video_file_video__source.setAttribute('src', media);
			me._ht_video_file_video__vid.addEventListener('loadedmetadata', function() {
				let videoAR = me._ht_video_file_video__vid.videoWidth / me._ht_video_file_video__vid.videoHeight;
				let elAR = me._ht_video_file_video.userData.width / me._ht_video_file_video.userData.height;
				if (videoAR > elAR) {
					me._ht_video_file_video.scale.set(1, (me._ht_video_file_video.userData.width / videoAR) / me._ht_video_file_video.userData.height, 1);
				} else {
					me._ht_video_file_video.scale.set((me._ht_video_file_video.userData.height * videoAR) / me._ht_video_file_video.userData.width, 1, 1);
				}
			}, false);
			me._ht_video_file_video__vid.appendChild(me._ht_video_file_video__source);
			videoTexture = new THREE.VideoTexture( me._ht_video_file_video__vid );
			videoTexture.name = 'ht_video_file_video_videoTexture';
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, transparent: true} );
			videoMaterial.name = 'ht_video_file_video_videoMaterial';
			videoMaterial.alphaTest = 0.5;
			me._ht_video_file_video.material = videoMaterial;
		}
		el.userData.ggId="ht_video_file_video";
		me._ht_video_file_video.userData.ggIsActive=function() {
			if (me._ht_video_file_video__vid != null) {
				return (me._ht_video_file_video__vid.paused == false && me._ht_video_file_video__vid.ended == false);
			} else {
				return false;
			}
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_video.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_file_hotspots') !== null) && (player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_video.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_video.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_video.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_video.visible=((!me._ht_video_file_video.material && Number(me._ht_video_file_video.userData.opacity>0)) || (me._ht_video_file_video.material && Number(me._ht_video_file_video.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_video.userData.visible=true;
					if (me._ht_video_file_video.userData.ggVideoNotLoaded) {
						me._ht_video_file_video.userData.ggInitMedia(me._ht_video_file_video.ggVideoSource);
					}
				}
				else {
			me._ht_video_file_video.visible=false;
			player.repaint();
			me._ht_video_file_video.userData.visible=false;
					me._ht_video_file_video.userData.ggInitMedia('');
				}
			}
		}
		me._ht_video_file_video.userData.onclick=function (e) {
			if (me._ht_video_file_video.ggApiPlayer) {
				if (me._ht_video_file_video.ggApiPlayerType == 'youtube') {
					let youtubeMediaFunction = function() {
						if (me._ht_video_file_video.ggApiPlayer.getPlayerState() == 1) {
							me._ht_video_file_video.ggApiPlayer.pauseVideo();
						} else {
							me._ht_video_file_video.ggApiPlayer.playVideo();
						}
					};
					if (me._ht_video_file_video.ggApiPlayerReady) {
						youtubeMediaFunction();
					} else {
						let youtubeApiInterval = setInterval(function() {
							if (me._ht_video_file_video.ggApiPlayerReady) {
								clearInterval(youtubeApiInterval);
								youtubeMediaFunction();
							}
						}, 100);
					}
				} else if (me._ht_video_file_video.ggApiPlayerType == 'vimeo') {
					var promise = me._ht_video_file_video.ggApiPlayer.getPaused();
					promise.then(function(result) {
						if (result == true) {
							me._ht_video_file_video.ggApiPlayer.play();
						} else {
							me._ht_video_file_video.ggApiPlayer.pause();
						}
					});
				}
			} else {
				player.playPauseSound("ht_video_file_video","1");
			}
		}
		me._ht_video_file_video.userData.hasOwnClickAction = true;
		me._ht_video_file_video.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file_bg.add(me._ht_video_file_video);
		me._ht_video_file.add(me._ht_video_file_bg);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_close.userData.svgGroupNormal) me._ht_video_file_close.userData.setOpacityInState(me._ht_video_file_close.userData.svgGroupNormal, v);
			if (me._ht_video_file_close.userData.svgGroupOver) me._ht_video_file_close.userData.setOpacityInState(me._ht_video_file_close.userData.svgGroupOver, v);
			if (me._ht_video_file_close.userData.svgGroupActive) me._ht_video_file_close.userData.setOpacityInState(me._ht_video_file_close.userData.svgGroupActive, v);
			me._ht_video_file_close.visible = (v>0 && me._ht_video_file_close.userData.visible);
		}
		el.translateX(2.1);
		el.translateY(0.975);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_close';
		el.userData.x = 2.1;
		el.userData.y = 0.975;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_close.visible
			let parentEl = me._ht_video_file_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_close.userData.opacity = v;
			v = v * me._ht_video_file_close.userData.parentOpacity;
			if (me._ht_video_file_close.userData.setOpacityInternal) me._ht_video_file_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_close.children.length; i++) {
				let child = me._ht_video_file_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_close.userData.parentOpacity = v;
			v = v * me._ht_video_file_close.userData.opacity
			if (me._ht_video_file_close.userData.setOpacityInternal) me._ht_video_file_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_close.children.length; i++) {
				let child = me._ht_video_file_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_video_file_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_video_file_close_clickTargetMaterial';
		me._ht_video_file_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_video_file_close.userData.clickTarget.name = 'ht_video_file_close_clickTarget';
		me._ht_video_file_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_video_file_close.userData.clickTarget.visible = false;
		me._ht_video_file_close.add(me._ht_video_file_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_video_file_close.svg', me._ht_video_file_close.userData.width / 100.0, me._ht_video_file_close.userData.height / 100.0);
			me._ht_video_file_close.add(group);
			me._ht_video_file_close.userData.svgGroupNormal = group;
			me._ht_video_file_close.userData.setOpacityInState(group, me._ht_video_file_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_video_file_close";
		me._ht_video_file_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_video_file_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_close.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_close.scale.set(transition_scale.startScale.x + (me._ht_video_file_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_close.position.x = (me._ht_video_file_close.position.x - me._ht_video_file_close.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_close.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_close.position.y = (me._ht_video_file_close.position.y - me._ht_video_file_close.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_close.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_file_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_close.scale.set(transition_scale.startScale.x + (me._ht_video_file_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_close.position.x = (me._ht_video_file_close.position.x - me._ht_video_file_close.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_close.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_close.position.y = (me._ht_video_file_close.position.y - me._ht_video_file_close.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_close.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_file_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_video_file_hotspots') !== null) && (player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_close.material ? me._ht_video_file_close.material.opacity : me._ht_video_file_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_close.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_file_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_close.userData.transitions.length; i++) {
						if (me._ht_video_file_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_close.userData.transitions[i].interval);
							me._ht_video_file_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_close.material ? me._ht_video_file_close.material.opacity : me._ht_video_file_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_close.userData.transitions.splice(me._ht_video_file_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_close.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_file_close.userData.onclick=function (e) {
			player.setVariableValue('vis_video_file_hotspots', player.getVariableValue('vis_video_file_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_video_file_close.userData.hasOwnClickAction = true;
		me._ht_video_file_close.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_video_file_close']=true;
			me._ht_video_file_close.logicBlock_scaling();
		}
		me._ht_video_file_close.userData.ontouchend=function (e) {
			me._ht_video_file_close.logicBlock_scaling();
		}
		me._ht_video_file_close.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_file_close']=false;
			me._ht_video_file_close.logicBlock_scaling();
		}
		me._ht_video_file_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file.add(me._ht_video_file_close);
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 50;
		el.userData.height = 50;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_CustomImage';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_customimage.visible
			let parentEl = me._ht_video_file_customimage.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_file_customimage.userData.opacity = v;
			v = v * me._ht_video_file_customimage.userData.parentOpacity;
			if (me._ht_video_file_customimage.userData.setOpacityInternal) me._ht_video_file_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_customimage.children.length; i++) {
				let child = me._ht_video_file_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_customimage.userData.parentOpacity = v;
			v = v * me._ht_video_file_customimage.userData.opacity
			if (me._ht_video_file_customimage.userData.setOpacityInternal) me._ht_video_file_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_customimage.children.length; i++) {
				let child = me._ht_video_file_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_customimage = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_file_customimage;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_file_customimage);
		}
		me._ht_video_file_customimage.userData.backgroundColorAlpha = 1;
		me._ht_video_file_customimage.userData.borderColorAlpha = 1;
		me._ht_video_file_customimage.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_customimage.userData.ggSubElement) {
				me._ht_video_file_customimage.userData.ggSubElement.material.opacity = v
				me._ht_video_file_customimage.userData.ggSubElement.visible = (v>0 && me._ht_video_file_customimage.userData.visible);
			}
			me._ht_video_file_customimage.visible = (v>0 && me._ht_video_file_customimage.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 50;
		currentHeight = 50;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'ht_video_file_CustomImage_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_video_file_customimage.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_video_file_customimage.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_video_file_CustomImage_subElementMaterial';
				me._ht_video_file_customimage.userData.ggSubElement.material = loadedMaterial;
				me._ht_video_file_customimage.userData.ggUpdatePosition();
				me._ht_video_file_customimage.userData.ggText = extUrl;
				me._ht_video_file_customimage.userData.setOpacity(me._ht_video_file_customimage.userData.opacity);
			});
		};
		if ((hotspot) && (hotspot.customimage)) {
			var extUrl=hotspot.customimage;
		}
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_video_file_CustomImage_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_video_file_CustomImage_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 50;
		el.userData.clientHeight = 50;
		el.userData.ggId="ht_video_file_CustomImage";
		me._ht_video_file_customimage.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_customimage.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_video_file_hotspots') !== null) && (player.getVariableValue('vis_video_file_hotspots')).indexOf("<"+me.hotspot.id+">") == -1)) && 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_customimage.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_customimage.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_customimage.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_customimage.visible=((!me._ht_video_file_customimage.material && Number(me._ht_video_file_customimage.userData.opacity>0)) || (me._ht_video_file_customimage.material && Number(me._ht_video_file_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_customimage.userData.visible=true;
				}
				else {
			me._ht_video_file_customimage.visible=false;
			player.repaint();
			me._ht_video_file_customimage.userData.visible=false;
				}
			}
		}
		me._ht_video_file_customimage.userData.onclick=function (e) {
			player.setVariableValue('vis_video_file_hotspots', player.getVariableValue('vis_video_file_hotspots') + "<"+me.hotspot.id+">");
			me._ht_video_file_video.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_file_customimage.userData.hasOwnClickAction = true;
		me._ht_video_file_customimage.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_video_file_customimage.userData.clientWidth;
			var parentHeight = me._ht_video_file_customimage.userData.clientHeight;
			var img = me._ht_video_file_customimage.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if ((hotspot) && (hotspot.customimage)) {
				currentWidth  = hotspot.customimagewidth;
				currentHeight = hotspot.customimageheight;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_video_file_CustomImage_imgGeometry';
			}
		}
		me._ht_video_file.add(me._ht_video_file_customimage);
		me._ht_video_file.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file.traverse((obj)=>{
				if (me._ht_video_file.material) {
					me._ht_video_file.material.transparent = (me._ht_video_file.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_file']=false;
		me._ht_video_file_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_icon.traverse((obj)=>{
				if (me._ht_video_file_icon.material) {
					me._ht_video_file_icon.material.transparent = (me._ht_video_file_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_file_icon']=false;
		me._ht_video_file_icon.logicBlock_scaling();
		me._ht_video_file_icon.logicBlock_visible();
		me._ht_video_file_tooltip.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_tooltip.traverse((obj)=>{
				if (me._ht_video_file_tooltip.material) {
					me._ht_video_file_tooltip.material.transparent = (me._ht_video_file_tooltip.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_video_file_tooltip.userData.ggUpdateText(true);
		me._ht_video_file_tooltip.logicBlock_visible();
		me._ht_video_file_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_bg.traverse((obj)=>{
				if (me._ht_video_file_bg.material) {
					me._ht_video_file_bg.material.transparent = (me._ht_video_file_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_file_bg.logicBlock_scaling();
		me._ht_video_file_bg.logicBlock_alpha();
		me._ht_video_file_video.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_video.traverse((obj)=>{
				if (me._ht_video_file_video.material) {
					me._ht_video_file_video.material.transparent = (me._ht_video_file_video.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_file_video.userData.ggVideoSource = 'media_vr/';
		me._ht_video_file_video.userData.ggVideoNotLoaded = true;
		me._ht_video_file_video.logicBlock_visible();
		me._ht_video_file_close.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_close.traverse((obj)=>{
				if (me._ht_video_file_close.material) {
					me._ht_video_file_close.material.transparent = (me._ht_video_file_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_file_close']=false;
		me._ht_video_file_close.logicBlock_scaling();
		me._ht_video_file_close.logicBlock_alpha();
		me._ht_video_file_customimage.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_customimage.traverse((obj)=>{
				if (me._ht_video_file_customimage.material) {
					me._ht_video_file_customimage.material.transparent = (me._ht_video_file_customimage.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_file_customimage.logicBlock_visible();
			me.ggEvent_activehotspotchanged=function() {
				me._ht_video_file_icon.logicBlock_visible();
				me._ht_video_file_tooltip.logicBlock_visible();
				me._ht_video_file_customimage.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_video_file.traverse((obj)=>{
						if (me._ht_video_file.material) {
							me._ht_video_file.material.transparent = (me._ht_video_file.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_video_file_icon.traverse((obj)=>{
						if (me._ht_video_file_icon.material) {
							me._ht_video_file_icon.material.transparent = (me._ht_video_file_icon.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_icon.logicBlock_visible();
					me._ht_video_file_tooltip.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_tooltip.traverse((obj)=>{
						if (me._ht_video_file_tooltip.material) {
							me._ht_video_file_tooltip.material.transparent = (me._ht_video_file_tooltip.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_tooltip.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_bg.traverse((obj)=>{
						if (me._ht_video_file_bg.material) {
							me._ht_video_file_bg.material.transparent = (me._ht_video_file_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_bg.logicBlock_scaling();
				me._ht_video_file_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_video.traverse((obj)=>{
						if (me._ht_video_file_video.material) {
							me._ht_video_file_video.material.transparent = (me._ht_video_file_video.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_video.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_close.traverse((obj)=>{
						if (me._ht_video_file_close.material) {
							me._ht_video_file_close.material.transparent = (me._ht_video_file_close.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_close.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_customimage.traverse((obj)=>{
						if (me._ht_video_file_customimage.material) {
							me._ht_video_file_customimage.material.transparent = (me._ht_video_file_customimage.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_customimage.logicBlock_visible();
			};
			me.ggEvent_configloaded=function() {
				me._ht_video_file_icon.logicBlock_visible();
				me._ht_video_file_tooltip.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_scaling();
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_video.logicBlock_visible();
				me._ht_video_file_close.logicBlock_alpha();
				me._ht_video_file_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_vis_video_file_hotspots=function() {
				me._ht_video_file_icon.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_scaling();
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_video.logicBlock_visible();
				me._ht_video_file_close.logicBlock_alpha();
				me._ht_video_file_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_video_file;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_node__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_node.visible = (v>0 && me._ht_node.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_node';
		el.userData.x = -2;
		el.userData.y = 1;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_node.visible
			let parentEl = me._ht_node.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node.userData.opacity = v;
			v = v * me._ht_node.userData.parentOpacity;
			if (me._ht_node.userData.setOpacityInternal) me._ht_node.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node.children.length; i++) {
				let child = me._ht_node.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node.userData.parentOpacity = v;
			v = v * me._ht_node.userData.opacity
			if (me._ht_node.userData.setOpacityInternal) me._ht_node.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node.children.length; i++) {
				let child = me._ht_node.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node = el;
		el.userData.ggId="ht_node";
		me._ht_node.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_node.userData.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.hasOwnClickAction = true;
		me._ht_node.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_node']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_node.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_node']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_node.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_node_icon.userData.svgGroupNormal) me._ht_node_icon.userData.setOpacityInState(me._ht_node_icon.userData.svgGroupNormal, v);
			if (me._ht_node_icon.userData.svgGroupOver) me._ht_node_icon.userData.setOpacityInState(me._ht_node_icon.userData.svgGroupOver, v);
			if (me._ht_node_icon.userData.svgGroupActive) me._ht_node_icon.userData.setOpacityInState(me._ht_node_icon.userData.svgGroupActive, v);
			me._ht_node_icon.visible = (v>0 && me._ht_node_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_node_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_node_icon.visible
			let parentEl = me._ht_node_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node_icon.userData.opacity = v;
			v = v * me._ht_node_icon.userData.parentOpacity;
			if (me._ht_node_icon.userData.setOpacityInternal) me._ht_node_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_icon.children.length; i++) {
				let child = me._ht_node_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_icon.userData.parentOpacity = v;
			v = v * me._ht_node_icon.userData.opacity
			if (me._ht_node_icon.userData.setOpacityInternal) me._ht_node_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_icon.children.length; i++) {
				let child = me._ht_node_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_node_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_node_icon_clickTargetMaterial';
		me._ht_node_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_node_icon.userData.clickTarget.name = 'ht_node_icon_clickTarget';
		me._ht_node_icon.userData.clickTarget.userData.clickInvisible = true;
		me._ht_node_icon.userData.clickTarget.visible = false;
		me._ht_node_icon.add(me._ht_node_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_node_icon.svg', me._ht_node_icon.userData.width / 100.0, me._ht_node_icon.userData.height / 100.0);
			me._ht_node_icon.add(group);
			me._ht_node_icon.userData.svgGroupNormal = group;
			me._ht_node_icon.userData.setOpacityInState(group, me._ht_node_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_node_icon";
		me._ht_node_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_node_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_node_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_node_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_node_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_node_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_node_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_node_icon.userData.transitions.length; i++) {
						if (me._ht_node_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_node_icon.userData.transitions[i].interval);
							me._ht_node_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_node_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_node_icon.scale.set(transition_scale.startScale.x + (me._ht_node_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_node_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_node_icon.position.x = (me._ht_node_icon.position.x - me._ht_node_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_node_icon.userData.curScaleOffX = scaleOffX;
							me._ht_node_icon.position.y = (me._ht_node_icon.position.y - me._ht_node_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_node_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_node_icon.userData.transitions.splice(me._ht_node_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_node_icon.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_node_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_node_icon.userData.transitions.length; i++) {
						if (me._ht_node_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_node_icon.userData.transitions[i].interval);
							me._ht_node_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_node_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_node_icon.scale.set(transition_scale.startScale.x + (me._ht_node_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_node_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_node_icon.position.x = (me._ht_node_icon.position.x - me._ht_node_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_node_icon.userData.curScaleOffX = scaleOffX;
							me._ht_node_icon.position.y = (me._ht_node_icon.position.y - me._ht_node_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_node_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_node_icon.userData.transitions.splice(me._ht_node_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_node_icon.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_node_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_node_icon.visible=false;
			player.repaint();
			me._ht_node_icon.userData.visible=false;
				}
				else {
			me._ht_node_icon.visible=((!me._ht_node_icon.material && Number(me._ht_node_icon.userData.opacity>0)) || (me._ht_node_icon.material && Number(me._ht_node_icon.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_node_icon.userData.visible=true;
				}
			}
		}
		me._ht_node_icon.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_node_icon']=true;
			me._ht_node_tooltip.logicBlock_visible();
			me._ht_node_icon.logicBlock_scaling();
		}
		me._ht_node_icon.userData.ontouchend=function (e) {
			me._ht_node_icon.logicBlock_scaling();
		}
		me._ht_node_icon.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_node_icon']=false;
			me._ht_node_tooltip.logicBlock_visible();
			me._ht_node_icon.logicBlock_scaling();
		}
		me._ht_node_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_node_tooltip_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.415);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_node_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.415;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_node_tooltip.visible
			let parentEl = me._ht_node_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node_tooltip.userData.opacity = v;
			v = v * me._ht_node_tooltip.userData.parentOpacity;
			if (me._ht_node_tooltip.userData.setOpacityInternal) me._ht_node_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_tooltip.children.length; i++) {
				let child = me._ht_node_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_tooltip.userData.parentOpacity = v;
			v = v * me._ht_node_tooltip.userData.opacity
			if (me._ht_node_tooltip.userData.setOpacityInternal) me._ht_node_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_tooltip.children.length; i++) {
				let child = me._ht_node_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node_tooltip = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_node_tooltip;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_node_tooltip);
			if (skin.rectHasRoundedCorners(me._ht_node_tooltip)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_node_tooltip.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_node_tooltip.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_node_tooltip.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_node_tooltip.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_node_tooltip_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_node_tooltip_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_node_tooltip.userData.backgroundColorAlpha = 0.784314;
		me._ht_node_tooltip.userData.borderColorAlpha = 1;
		me._ht_node_tooltip.userData.setOpacityInternal = function(v) {
			me._ht_node_tooltip.material.opacity = v;
			if (me._ht_node_tooltip.userData.hasScrollbar) {
				me._ht_node_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_node_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_node_tooltip.userData.ggSubElement) {
				me._ht_node_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_node_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_node_tooltip.userData.visible);
			}
			me._ht_node_tooltip.visible = (v>0 && me._ht_node_tooltip.userData.visible);
		}
		me._ht_node_tooltip.userData.setBackgroundColor = function(v) {
			me._ht_node_tooltip.material.color = v;
		}
		me._ht_node_tooltip.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_tooltip.userData.backgroundColorAlpha = v;
			me._ht_node_tooltip.userData.setOpacity(me._ht_node_tooltip.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 44;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_node_tooltip;
			var canv = me._ht_node_tooltip.userData.textCanvas;
			var ctx = me._ht_node_tooltip.userData.textCanvasContext;
			var tmpCanv = me._ht_node_tooltip.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_node_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_node_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_node_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_node_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_node_tooltip.userData.scrollPosPercent ? tmpCanv.height * me._ht_node_tooltip.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_node_tooltip.userData.boxWidthCanv / 100.0;
		height = me._ht_node_tooltip.userData.boxHeightCanv / 100.0;
		me._ht_node_tooltip.userData.width = me._ht_node_tooltip.userData.boxWidthCanv;
		me._ht_node_tooltip.userData.height = me._ht_node_tooltip.userData.boxHeightCanv;
		me._ht_node_tooltip.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_node_tooltip, 0, -30);
		me._ht_node_tooltip.position.x = newPos.x;
		me._ht_node_tooltip.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_node_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_node_tooltip.material.map) {
				me._ht_node_tooltip.material.map.dispose();
			}
			me._ht_node_tooltip.material.map = textTexture;
			me._ht_node_tooltip.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_node_tooltip, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_node_tooltip, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: center; white-space: pre; padding: 5px; overflow: hidden;' + '; color: ' + me._ht_node_tooltip.userData.textColor + ' !important;', false, true, false);
			me._ht_node_tooltip.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_node_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_node_tooltip.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_node_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_node_tooltip";
		me._ht_node_tooltip.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_node_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_node_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_node_tooltip.visible=((!me._ht_node_tooltip.material && Number(me._ht_node_tooltip.userData.opacity>0)) || (me._ht_node_tooltip.material && Number(me._ht_node_tooltip.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_node_tooltip.userData.visible=true;
				}
				else {
			me._ht_node_tooltip.visible=false;
			player.repaint();
			me._ht_node_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_node_tooltip.userData.ggUpdatePosition=function (useTransition) {
				me._ht_node_tooltip.userData.ggUpdateText(true);
		}
		me._ht_node_icon.add(me._ht_node_tooltip);
		me._ht_node.add(me._ht_node_icon);
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 50;
		el.userData.height = 50;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_node_CustomImage';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_node_customimage.visible
			let parentEl = me._ht_node_customimage.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_node_customimage.userData.opacity = v;
			v = v * me._ht_node_customimage.userData.parentOpacity;
			if (me._ht_node_customimage.userData.setOpacityInternal) me._ht_node_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_customimage.children.length; i++) {
				let child = me._ht_node_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_customimage.userData.parentOpacity = v;
			v = v * me._ht_node_customimage.userData.opacity
			if (me._ht_node_customimage.userData.setOpacityInternal) me._ht_node_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_customimage.children.length; i++) {
				let child = me._ht_node_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_node_customimage = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_node_customimage;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_node_customimage);
		}
		me._ht_node_customimage.userData.backgroundColorAlpha = 1;
		me._ht_node_customimage.userData.borderColorAlpha = 1;
		me._ht_node_customimage.userData.setOpacityInternal = function(v) {
			if (me._ht_node_customimage.userData.ggSubElement) {
				me._ht_node_customimage.userData.ggSubElement.material.opacity = v
				me._ht_node_customimage.userData.ggSubElement.visible = (v>0 && me._ht_node_customimage.userData.visible);
			}
			me._ht_node_customimage.visible = (v>0 && me._ht_node_customimage.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 50;
		currentHeight = 50;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'ht_node_CustomImage_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_node_customimage.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_node_customimage.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_node_CustomImage_subElementMaterial';
				me._ht_node_customimage.userData.ggSubElement.material = loadedMaterial;
				me._ht_node_customimage.userData.ggUpdatePosition();
				me._ht_node_customimage.userData.ggText = extUrl;
				me._ht_node_customimage.userData.setOpacity(me._ht_node_customimage.userData.opacity);
			});
		};
		if ((hotspot) && (hotspot.customimage)) {
			var extUrl=hotspot.customimage;
		}
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_node_CustomImage_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_node_CustomImage_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 50;
		el.userData.clientHeight = 50;
		el.userData.ggId="ht_node_CustomImage";
		me._ht_node_customimage.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_node_customimage.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_customimage.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_customimage.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_customimage.ggCurrentLogicStateVisible == 0) {
			me._ht_node_customimage.visible=((!me._ht_node_customimage.material && Number(me._ht_node_customimage.userData.opacity>0)) || (me._ht_node_customimage.material && Number(me._ht_node_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_node_customimage.userData.visible=true;
				}
				else {
			me._ht_node_customimage.visible=false;
			player.repaint();
			me._ht_node_customimage.userData.visible=false;
				}
			}
		}
		me._ht_node_customimage.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_node_customimage.userData.clientWidth;
			var parentHeight = me._ht_node_customimage.userData.clientHeight;
			var img = me._ht_node_customimage.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if ((hotspot) && (hotspot.customimage)) {
				currentWidth  = hotspot.customimagewidth;
				currentHeight = hotspot.customimageheight;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_node_CustomImage_imgGeometry';
			}
		}
		me._ht_node.add(me._ht_node_customimage);
		me._ht_node.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node.traverse((obj)=>{
				if (me._ht_node.material) {
					me._ht_node.material.transparent = (me._ht_node.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_node']=false;
		me._ht_node_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_icon.traverse((obj)=>{
				if (me._ht_node_icon.material) {
					me._ht_node_icon.material.transparent = (me._ht_node_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_node_icon']=false;
		me._ht_node_icon.logicBlock_scaling();
		me._ht_node_icon.logicBlock_visible();
		me._ht_node_tooltip.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_tooltip.traverse((obj)=>{
				if (me._ht_node_tooltip.material) {
					me._ht_node_tooltip.material.transparent = (me._ht_node_tooltip.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_node_tooltip.userData.ggUpdateText(true);
		me._ht_node_tooltip.logicBlock_visible();
		me._ht_node_customimage.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_customimage.traverse((obj)=>{
				if (me._ht_node_customimage.material) {
					me._ht_node_customimage.material.transparent = (me._ht_node_customimage.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_node_customimage.logicBlock_visible();
			me.ggEvent_activehotspotchanged=function() {
				me._ht_node_icon.logicBlock_visible();
				me._ht_node_tooltip.logicBlock_visible();
				me._ht_node_customimage.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_node.traverse((obj)=>{
						if (me._ht_node.material) {
							me._ht_node.material.transparent = (me._ht_node.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_node_icon.traverse((obj)=>{
						if (me._ht_node_icon.material) {
							me._ht_node_icon.material.transparent = (me._ht_node_icon.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_node_icon.logicBlock_visible();
					me._ht_node_tooltip.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_node_tooltip.traverse((obj)=>{
						if (me._ht_node_tooltip.material) {
							me._ht_node_tooltip.material.transparent = (me._ht_node_tooltip.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_node_tooltip.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_node_customimage.traverse((obj)=>{
						if (me._ht_node_customimage.material) {
							me._ht_node_customimage.material.transparent = (me._ht_node_customimage.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_node_customimage.logicBlock_visible();
			};
			me.ggEvent_configloaded=function() {
				me._ht_node_icon.logicBlock_visible();
				me._ht_node_tooltip.logicBlock_visible();
				me._ht_node_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_node;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_image__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_image.visible = (v>0 && me._ht_image.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_image';
		el.userData.x = -2;
		el.userData.y = 1;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_image.visible
			let parentEl = me._ht_image.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image.userData.opacity = v;
			v = v * me._ht_image.userData.parentOpacity;
			if (me._ht_image.userData.setOpacityInternal) me._ht_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image.children.length; i++) {
				let child = me._ht_image.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image.userData.parentOpacity = v;
			v = v * me._ht_image.userData.opacity
			if (me._ht_image.userData.setOpacityInternal) me._ht_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image.children.length; i++) {
				let child = me._ht_image.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image = el;
		el.userData.ggId="ht_image";
		me._ht_image.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_image.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_image']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_image']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_image.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_image_icon.userData.svgGroupNormal) me._ht_image_icon.userData.setOpacityInState(me._ht_image_icon.userData.svgGroupNormal, v);
			if (me._ht_image_icon.userData.svgGroupOver) me._ht_image_icon.userData.setOpacityInState(me._ht_image_icon.userData.svgGroupOver, v);
			if (me._ht_image_icon.userData.svgGroupActive) me._ht_image_icon.userData.setOpacityInState(me._ht_image_icon.userData.svgGroupActive, v);
			me._ht_image_icon.visible = (v>0 && me._ht_image_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(-0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_icon';
		el.userData.x = 0;
		el.userData.y = -0.01;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_image_icon.visible
			let parentEl = me._ht_image_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_icon.userData.opacity = v;
			v = v * me._ht_image_icon.userData.parentOpacity;
			if (me._ht_image_icon.userData.setOpacityInternal) me._ht_image_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_icon.children.length; i++) {
				let child = me._ht_image_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_icon.userData.parentOpacity = v;
			v = v * me._ht_image_icon.userData.opacity
			if (me._ht_image_icon.userData.setOpacityInternal) me._ht_image_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_icon.children.length; i++) {
				let child = me._ht_image_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_image_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_image_icon_clickTargetMaterial';
		me._ht_image_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_image_icon.userData.clickTarget.name = 'ht_image_icon_clickTarget';
		me._ht_image_icon.userData.clickTarget.userData.clickInvisible = true;
		me._ht_image_icon.userData.clickTarget.visible = false;
		me._ht_image_icon.add(me._ht_image_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_image_icon.svg', me._ht_image_icon.userData.width / 100.0, me._ht_image_icon.userData.height / 100.0);
			me._ht_image_icon.add(group);
			me._ht_image_icon.userData.svgGroupNormal = group;
			me._ht_image_icon.userData.setOpacityInState(group, me._ht_image_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_image_icon";
		me._ht_image_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_image_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_image_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_image_icon.userData.transitions.length; i++) {
						if (me._ht_image_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_icon.userData.transitions[i].interval);
							me._ht_image_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_icon.scale.set(transition_scale.startScale.x + (me._ht_image_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_icon.position.x = (me._ht_image_icon.position.x - me._ht_image_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_image_icon.userData.curScaleOffX = scaleOffX;
							me._ht_image_icon.position.y = (me._ht_image_icon.position.y - me._ht_image_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_image_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_icon.userData.transitions.splice(me._ht_image_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_icon.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_image_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_icon.userData.transitions.length; i++) {
						if (me._ht_image_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_icon.userData.transitions[i].interval);
							me._ht_image_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_icon.scale.set(transition_scale.startScale.x + (me._ht_image_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_icon.position.x = (me._ht_image_icon.position.x - me._ht_image_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_image_icon.userData.curScaleOffX = scaleOffX;
							me._ht_image_icon.position.y = (me._ht_image_icon.position.y - me._ht_image_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_image_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_icon.userData.transitions.splice(me._ht_image_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_icon.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_image_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('vis_image_hotspots') == "true")) || 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_image_icon.visible=false;
			player.repaint();
			me._ht_image_icon.userData.visible=false;
				}
				else {
			me._ht_image_icon.visible=((!me._ht_image_icon.material && Number(me._ht_image_icon.userData.opacity>0)) || (me._ht_image_icon.material && Number(me._ht_image_icon.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_icon.userData.visible=true;
				}
			}
		}
		me._ht_image_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_image_hotspots', player.getVariableValue('vis_image_hotspots') + "<"+me.hotspot.id+">");
		}
		me._ht_image_icon.userData.hasOwnClickAction = true;
		me._ht_image_icon.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_image_icon']=true;
			me._ht_image_tooltip.logicBlock_visible();
			me._ht_image_icon.logicBlock_scaling();
		}
		me._ht_image_icon.userData.ontouchend=function (e) {
			me._ht_image_icon.logicBlock_scaling();
		}
		me._ht_image_icon.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_image_icon']=false;
			me._ht_image_tooltip.logicBlock_visible();
			me._ht_image_icon.logicBlock_scaling();
		}
		me._ht_image_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_image_tooltip_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.415);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.415;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_image_tooltip.visible
			let parentEl = me._ht_image_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_tooltip.userData.opacity = v;
			v = v * me._ht_image_tooltip.userData.parentOpacity;
			if (me._ht_image_tooltip.userData.setOpacityInternal) me._ht_image_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_tooltip.children.length; i++) {
				let child = me._ht_image_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_tooltip.userData.parentOpacity = v;
			v = v * me._ht_image_tooltip.userData.opacity
			if (me._ht_image_tooltip.userData.setOpacityInternal) me._ht_image_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_tooltip.children.length; i++) {
				let child = me._ht_image_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_tooltip = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_image_tooltip;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_tooltip);
			if (skin.rectHasRoundedCorners(me._ht_image_tooltip)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_image_tooltip.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_image_tooltip.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_image_tooltip.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_image_tooltip.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_image_tooltip_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_image_tooltip_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_image_tooltip.userData.backgroundColorAlpha = 0.784314;
		me._ht_image_tooltip.userData.borderColorAlpha = 1;
		me._ht_image_tooltip.userData.setOpacityInternal = function(v) {
			me._ht_image_tooltip.material.opacity = v;
			if (me._ht_image_tooltip.userData.hasScrollbar) {
				me._ht_image_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_image_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_image_tooltip.userData.ggSubElement) {
				me._ht_image_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_image_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_image_tooltip.userData.visible);
			}
			me._ht_image_tooltip.visible = (v>0 && me._ht_image_tooltip.userData.visible);
		}
		me._ht_image_tooltip.userData.setBackgroundColor = function(v) {
			me._ht_image_tooltip.material.color = v;
		}
		me._ht_image_tooltip.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_tooltip.userData.backgroundColorAlpha = v;
			me._ht_image_tooltip.userData.setOpacity(me._ht_image_tooltip.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 44;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_image_tooltip;
			var canv = me._ht_image_tooltip.userData.textCanvas;
			var ctx = me._ht_image_tooltip.userData.textCanvasContext;
			var tmpCanv = me._ht_image_tooltip.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_image_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_image_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_image_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_image_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_image_tooltip.userData.scrollPosPercent ? tmpCanv.height * me._ht_image_tooltip.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_image_tooltip.userData.boxWidthCanv / 100.0;
		height = me._ht_image_tooltip.userData.boxHeightCanv / 100.0;
		me._ht_image_tooltip.userData.width = me._ht_image_tooltip.userData.boxWidthCanv;
		me._ht_image_tooltip.userData.height = me._ht_image_tooltip.userData.boxHeightCanv;
		me._ht_image_tooltip.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_image_tooltip, 0, -30);
		me._ht_image_tooltip.position.x = newPos.x;
		me._ht_image_tooltip.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_image_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_image_tooltip.material.map) {
				me._ht_image_tooltip.material.map.dispose();
			}
			me._ht_image_tooltip.material.map = textTexture;
			me._ht_image_tooltip.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_image_tooltip, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_image_tooltip, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: center; white-space: pre; padding: 5px; overflow: hidden;' + '; color: ' + me._ht_image_tooltip.userData.textColor + ' !important;', false, true, false);
			me._ht_image_tooltip.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_image_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_image_tooltip.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_image_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_image_tooltip";
		me._ht_image_tooltip.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_image_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_image_tooltip.visible=((!me._ht_image_tooltip.material && Number(me._ht_image_tooltip.userData.opacity>0)) || (me._ht_image_tooltip.material && Number(me._ht_image_tooltip.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_tooltip.userData.visible=true;
				}
				else {
			me._ht_image_tooltip.visible=false;
			player.repaint();
			me._ht_image_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_image_tooltip.userData.ggUpdatePosition=function (useTransition) {
				me._ht_image_tooltip.userData.ggUpdateText(true);
		}
		me._ht_image_icon.add(me._ht_image_tooltip);
		me._ht_image.add(me._ht_image_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#00aaff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_image_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(1.782);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 360;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.782;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_image_bg.visible
			let parentEl = me._ht_image_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_bg.userData.opacity = v;
			v = v * me._ht_image_bg.userData.parentOpacity;
			if (me._ht_image_bg.userData.setOpacityInternal) me._ht_image_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_bg.children.length; i++) {
				let child = me._ht_image_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_bg.userData.parentOpacity = v;
			v = v * me._ht_image_bg.userData.opacity
			if (me._ht_image_bg.userData.setOpacityInternal) me._ht_image_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_bg.children.length; i++) {
				let child = me._ht_image_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_image_bg;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_bg);
			if (skin.rectHasRoundedCorners(me._ht_image_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_image_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_image_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_image_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_image_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_image_bg_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_image_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_image_bg.userData.backgroundColorAlpha = 0.784314;
		me._ht_image_bg.userData.borderColorAlpha = 1;
		me._ht_image_bg.userData.setOpacityInternal = function(v) {
			me._ht_image_bg.material.opacity = v * me._ht_image_bg.userData.backgroundColorAlpha;
			if (me._ht_image_bg.userData.ggSubElement) {
				me._ht_image_bg.userData.ggSubElement.material.opacity = v
				me._ht_image_bg.userData.ggSubElement.visible = (v>0 && me._ht_image_bg.userData.visible);
			}
			me._ht_image_bg.visible = (v>0 && me._ht_image_bg.userData.visible);
		}
		me._ht_image_bg.userData.setBackgroundColor = function(v) {
			me._ht_image_bg.material.color = v;
		}
		me._ht_image_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_bg.userData.backgroundColorAlpha = v;
			me._ht_image_bg.userData.setOpacity(me._ht_image_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.ggId="ht_image_bg";
		me._ht_image_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_image_hotspots') !== null) && (player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_image_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_bg.scale.set(transition_scale.startScale.x + (me._ht_image_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_bg.position.x = (me._ht_image_bg.position.x - me._ht_image_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_image_bg.userData.curScaleOffX = scaleOffX;
							me._ht_image_bg.position.y = (me._ht_image_bg.position.y - me._ht_image_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_image_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_image_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_bg.scale.set(transition_scale.startScale.x + (me._ht_image_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_bg.position.x = (me._ht_image_bg.position.x - me._ht_image_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_image_bg.userData.curScaleOffX = scaleOffX;
							me._ht_image_bg.position.y = (me._ht_image_bg.position.y - me._ht_image_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_image_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_image_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_image_hotspots') !== null) && (player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_bg.material ? me._ht_image_bg.material.opacity : me._ht_image_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_image_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_bg.userData.transitions.length; i++) {
						if (me._ht_image_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_bg.userData.transitions[i].interval);
							me._ht_image_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_bg.material ? me._ht_image_bg.material.opacity : me._ht_image_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_bg.userData.transitions.splice(me._ht_image_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_image_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 340;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_img';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_image_img.visible
			let parentEl = me._ht_image_img.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_img.userData.opacity = v;
			v = v * me._ht_image_img.userData.parentOpacity;
			if (me._ht_image_img.userData.setOpacityInternal) me._ht_image_img.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_img.children.length; i++) {
				let child = me._ht_image_img.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_img.userData.parentOpacity = v;
			v = v * me._ht_image_img.userData.opacity
			if (me._ht_image_img.userData.setOpacityInternal) me._ht_image_img.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_img.children.length; i++) {
				let child = me._ht_image_img.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_img = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_image_img;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_img);
		}
		me._ht_image_img.userData.backgroundColorAlpha = 1;
		me._ht_image_img.userData.borderColorAlpha = 1;
		me._ht_image_img.userData.setOpacityInternal = function(v) {
			if (me._ht_image_img.userData.ggSubElement) {
				me._ht_image_img.userData.ggSubElement.material.opacity = v
				me._ht_image_img.userData.ggSubElement.visible = (v>0 && me._ht_image_img.userData.visible);
			}
			me._ht_image_img.visible = (v>0 && me._ht_image_img.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 340;
		currentHeight = 340;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'ht_image_img_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_image_img.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_image_img.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_image_img_subElementMaterial';
				me._ht_image_img.userData.ggSubElement.material = loadedMaterial;
				me._ht_image_img.userData.ggUpdatePosition();
				me._ht_image_img.userData.ggText = extUrl;
				me._ht_image_img.userData.setOpacity(me._ht_image_img.userData.opacity);
			});
		};
		player.addListener('changenode', function() {
		});
		var extUrl=basePath + ""+player._(me.hotspot.url)+"";
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_image_img_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_image_img_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 340;
		el.userData.clientHeight = 340;
		el.userData.ggId="ht_image_img";
		me._ht_image_img.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_img.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_image_img.userData.clientWidth;
			var parentHeight = me._ht_image_img.userData.clientHeight;
			var img = me._ht_image_img.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = parentHeight * aspectRatioImg;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_image_img_imgGeometry';
			} else {
				currentWidth = parentWidth;
				currentHeight = parentWidth / aspectRatioImg;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_image_img_imgGeometry';
			};
		}
		me._ht_image_bg.add(me._ht_image_img);
		me._ht_image.add(me._ht_image_bg);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_image_close.userData.svgGroupNormal) me._ht_image_close.userData.setOpacityInState(me._ht_image_close.userData.svgGroupNormal, v);
			if (me._ht_image_close.userData.svgGroupOver) me._ht_image_close.userData.setOpacityInState(me._ht_image_close.userData.svgGroupOver, v);
			if (me._ht_image_close.userData.svgGroupActive) me._ht_image_close.userData.setOpacityInState(me._ht_image_close.userData.svgGroupActive, v);
			me._ht_image_close.visible = (v>0 && me._ht_image_close.userData.visible);
		}
		el.translateX(2.1);
		el.translateY(1.575);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_close';
		el.userData.x = 2.1;
		el.userData.y = 1.575;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_image_close.visible
			let parentEl = me._ht_image_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_close.userData.opacity = v;
			v = v * me._ht_image_close.userData.parentOpacity;
			if (me._ht_image_close.userData.setOpacityInternal) me._ht_image_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_close.children.length; i++) {
				let child = me._ht_image_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_close.userData.parentOpacity = v;
			v = v * me._ht_image_close.userData.opacity
			if (me._ht_image_close.userData.setOpacityInternal) me._ht_image_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_close.children.length; i++) {
				let child = me._ht_image_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_image_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_image_close_clickTargetMaterial';
		me._ht_image_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_image_close.userData.clickTarget.name = 'ht_image_close_clickTarget';
		me._ht_image_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_image_close.userData.clickTarget.visible = false;
		me._ht_image_close.add(me._ht_image_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_image_close.svg', me._ht_image_close.userData.width / 100.0, me._ht_image_close.userData.height / 100.0);
			me._ht_image_close.add(group);
			me._ht_image_close.userData.svgGroupNormal = group;
			me._ht_image_close.userData.setOpacityInState(group, me._ht_image_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_image_close";
		me._ht_image_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_image_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_close.ggCurrentLogicStateScaling == 0) {
					me._ht_image_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_close.scale.set(transition_scale.startScale.x + (me._ht_image_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_close.position.x = (me._ht_image_close.position.x - me._ht_image_close.userData.curScaleOffX) + scaleOffX;
							me._ht_image_close.userData.curScaleOffX = scaleOffX;
							me._ht_image_close.position.y = (me._ht_image_close.position.y - me._ht_image_close.userData.curScaleOffY) + scaleOffY;
							me._ht_image_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_close.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_image_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_close.scale.set(transition_scale.startScale.x + (me._ht_image_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_close.position.x = (me._ht_image_close.position.x - me._ht_image_close.userData.curScaleOffX) + scaleOffX;
							me._ht_image_close.userData.curScaleOffX = scaleOffX;
							me._ht_image_close.position.y = (me._ht_image_close.position.y - me._ht_image_close.userData.curScaleOffY) + scaleOffY;
							me._ht_image_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_close.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_image_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_image_hotspots') !== null) && (player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_close.material ? me._ht_image_close.material.opacity : me._ht_image_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_close.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_image_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_close.userData.transitions.length; i++) {
						if (me._ht_image_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_close.userData.transitions[i].interval);
							me._ht_image_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_close.material ? me._ht_image_close.material.opacity : me._ht_image_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_close.userData.transitions.splice(me._ht_image_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_close.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_image_close.userData.onclick=function (e) {
			player.setVariableValue('vis_image_hotspots', player.getVariableValue('vis_image_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_image_close.userData.hasOwnClickAction = true;
		me._ht_image_close.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_image_close']=true;
			me._ht_image_close.logicBlock_scaling();
		}
		me._ht_image_close.userData.ontouchend=function (e) {
			me._ht_image_close.logicBlock_scaling();
		}
		me._ht_image_close.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_image_close']=false;
			me._ht_image_close.logicBlock_scaling();
		}
		me._ht_image_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_image.add(me._ht_image_close);
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 50;
		el.userData.height = 50;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_CustomImage';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_image_customimage.visible
			let parentEl = me._ht_image_customimage.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_image_customimage.userData.opacity = v;
			v = v * me._ht_image_customimage.userData.parentOpacity;
			if (me._ht_image_customimage.userData.setOpacityInternal) me._ht_image_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_customimage.children.length; i++) {
				let child = me._ht_image_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_customimage.userData.parentOpacity = v;
			v = v * me._ht_image_customimage.userData.opacity
			if (me._ht_image_customimage.userData.setOpacityInternal) me._ht_image_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_customimage.children.length; i++) {
				let child = me._ht_image_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_customimage = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_image_customimage;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_customimage);
		}
		me._ht_image_customimage.userData.backgroundColorAlpha = 1;
		me._ht_image_customimage.userData.borderColorAlpha = 1;
		me._ht_image_customimage.userData.setOpacityInternal = function(v) {
			if (me._ht_image_customimage.userData.ggSubElement) {
				me._ht_image_customimage.userData.ggSubElement.material.opacity = v
				me._ht_image_customimage.userData.ggSubElement.visible = (v>0 && me._ht_image_customimage.userData.visible);
			}
			me._ht_image_customimage.visible = (v>0 && me._ht_image_customimage.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 50;
		currentHeight = 50;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'ht_image_CustomImage_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_image_customimage.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_image_customimage.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_image_CustomImage_subElementMaterial';
				me._ht_image_customimage.userData.ggSubElement.material = loadedMaterial;
				me._ht_image_customimage.userData.ggUpdatePosition();
				me._ht_image_customimage.userData.ggText = extUrl;
				me._ht_image_customimage.userData.setOpacity(me._ht_image_customimage.userData.opacity);
			});
		};
		if ((hotspot) && (hotspot.customimage)) {
			var extUrl=hotspot.customimage;
		}
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_image_CustomImage_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_image_CustomImage_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 50;
		el.userData.clientHeight = 50;
		el.userData.ggId="ht_image_CustomImage";
		me._ht_image_customimage.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_customimage.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_image_hotspots') !== null) && (player.getVariableValue('vis_image_hotspots')).indexOf("<"+me.hotspot.id+">") == -1)) && 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_customimage.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_customimage.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_customimage.ggCurrentLogicStateVisible == 0) {
			me._ht_image_customimage.visible=((!me._ht_image_customimage.material && Number(me._ht_image_customimage.userData.opacity>0)) || (me._ht_image_customimage.material && Number(me._ht_image_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_customimage.userData.visible=true;
				}
				else {
			me._ht_image_customimage.visible=false;
			player.repaint();
			me._ht_image_customimage.userData.visible=false;
				}
			}
		}
		me._ht_image_customimage.userData.onclick=function (e) {
			player.setVariableValue('vis_image_hotspots', player.getVariableValue('vis_image_hotspots') + "<"+me.hotspot.id+">");
		}
		me._ht_image_customimage.userData.hasOwnClickAction = true;
		me._ht_image_customimage.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_image_customimage.userData.clientWidth;
			var parentHeight = me._ht_image_customimage.userData.clientHeight;
			var img = me._ht_image_customimage.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if ((hotspot) && (hotspot.customimage)) {
				currentWidth  = hotspot.customimagewidth;
				currentHeight = hotspot.customimageheight;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_image_CustomImage_imgGeometry';
			}
		}
		me._ht_image.add(me._ht_image_customimage);
		me._ht_image.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image.traverse((obj)=>{
				if (me._ht_image.material) {
					me._ht_image.material.transparent = (me._ht_image.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_image']=false;
		me._ht_image_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_icon.traverse((obj)=>{
				if (me._ht_image_icon.material) {
					me._ht_image_icon.material.transparent = (me._ht_image_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_image_icon']=false;
		me._ht_image_icon.logicBlock_scaling();
		me._ht_image_icon.logicBlock_visible();
		me._ht_image_tooltip.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_tooltip.traverse((obj)=>{
				if (me._ht_image_tooltip.material) {
					me._ht_image_tooltip.material.transparent = (me._ht_image_tooltip.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_image_tooltip.userData.ggUpdateText(true);
		me._ht_image_tooltip.logicBlock_visible();
		me._ht_image_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_bg.traverse((obj)=>{
				if (me._ht_image_bg.material) {
					me._ht_image_bg.material.transparent = (me._ht_image_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_image_bg.logicBlock_scaling();
		me._ht_image_bg.logicBlock_alpha();
		me._ht_image_img.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_img.traverse((obj)=>{
				if (me._ht_image_img.material) {
					me._ht_image_img.material.transparent = (me._ht_image_img.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_image_close.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_close.traverse((obj)=>{
				if (me._ht_image_close.material) {
					me._ht_image_close.material.transparent = (me._ht_image_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_image_close']=false;
		me._ht_image_close.logicBlock_scaling();
		me._ht_image_close.logicBlock_alpha();
		me._ht_image_customimage.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_customimage.traverse((obj)=>{
				if (me._ht_image_customimage.material) {
					me._ht_image_customimage.material.transparent = (me._ht_image_customimage.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_image_customimage.logicBlock_visible();
			me.ggEvent_activehotspotchanged=function() {
				me._ht_image_icon.logicBlock_visible();
				me._ht_image_tooltip.logicBlock_visible();
				me._ht_image_customimage.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_image.traverse((obj)=>{
						if (me._ht_image.material) {
							me._ht_image.material.transparent = (me._ht_image.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_image_icon.traverse((obj)=>{
						if (me._ht_image_icon.material) {
							me._ht_image_icon.material.transparent = (me._ht_image_icon.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_icon.logicBlock_visible();
					me._ht_image_tooltip.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_image_tooltip.traverse((obj)=>{
						if (me._ht_image_tooltip.material) {
							me._ht_image_tooltip.material.transparent = (me._ht_image_tooltip.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_tooltip.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_image_bg.traverse((obj)=>{
						if (me._ht_image_bg.material) {
							me._ht_image_bg.material.transparent = (me._ht_image_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_bg.logicBlock_scaling();
				me._ht_image_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_image_img.traverse((obj)=>{
						if (me._ht_image_img.material) {
							me._ht_image_img.material.transparent = (me._ht_image_img.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_image_close.traverse((obj)=>{
						if (me._ht_image_close.material) {
							me._ht_image_close.material.transparent = (me._ht_image_close.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_close.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_image_customimage.traverse((obj)=>{
						if (me._ht_image_customimage.material) {
							me._ht_image_customimage.material.transparent = (me._ht_image_customimage.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_customimage.logicBlock_visible();
			};
			me.ggEvent_configloaded=function() {
				me._ht_image_icon.logicBlock_visible();
				me._ht_image_tooltip.logicBlock_visible();
				me._ht_image_bg.logicBlock_scaling();
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_close.logicBlock_alpha();
				me._ht_image_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_vis_image_hotspots=function() {
				me._ht_image_icon.logicBlock_visible();
				me._ht_image_bg.logicBlock_scaling();
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_close.logicBlock_alpha();
				me._ht_image_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_image;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_info__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_info.visible = (v>0 && me._ht_info.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_info';
		el.userData.x = -2;
		el.userData.y = 1;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_info.visible
			let parentEl = me._ht_info.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info.userData.opacity = v;
			v = v * me._ht_info.userData.parentOpacity;
			if (me._ht_info.userData.setOpacityInternal) me._ht_info.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info.children.length; i++) {
				let child = me._ht_info.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info.userData.parentOpacity = v;
			v = v * me._ht_info.userData.opacity
			if (me._ht_info.userData.setOpacityInternal) me._ht_info.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info.children.length; i++) {
				let child = me._ht_info.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info = el;
		el.userData.ggId="ht_info";
		me._ht_info.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_info.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_info']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_info.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_info']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_info.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_info_icon.userData.svgGroupNormal) me._ht_info_icon.userData.setOpacityInState(me._ht_info_icon.userData.svgGroupNormal, v);
			if (me._ht_info_icon.userData.svgGroupOver) me._ht_info_icon.userData.setOpacityInState(me._ht_info_icon.userData.svgGroupOver, v);
			if (me._ht_info_icon.userData.svgGroupActive) me._ht_info_icon.userData.setOpacityInState(me._ht_info_icon.userData.svgGroupActive, v);
			me._ht_info_icon.visible = (v>0 && me._ht_info_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_icon';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._ht_info_icon.visible
			let parentEl = me._ht_info_icon.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_icon.userData.opacity = v;
			v = v * me._ht_info_icon.userData.parentOpacity;
			if (me._ht_info_icon.userData.setOpacityInternal) me._ht_info_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_icon.children.length; i++) {
				let child = me._ht_info_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_icon.userData.parentOpacity = v;
			v = v * me._ht_info_icon.userData.opacity
			if (me._ht_info_icon.userData.setOpacityInternal) me._ht_info_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_icon.children.length; i++) {
				let child = me._ht_info_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_info_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_info_icon_clickTargetMaterial';
		me._ht_info_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_info_icon.userData.clickTarget.name = 'ht_info_icon_clickTarget';
		me._ht_info_icon.userData.clickTarget.userData.clickInvisible = true;
		me._ht_info_icon.userData.clickTarget.visible = false;
		me._ht_info_icon.add(me._ht_info_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_info_icon.svg', me._ht_info_icon.userData.width / 100.0, me._ht_info_icon.userData.height / 100.0);
			me._ht_info_icon.add(group);
			me._ht_info_icon.userData.svgGroupNormal = group;
			me._ht_info_icon.userData.setOpacityInState(group, me._ht_info_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_info_icon";
		me._ht_info_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_icon.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_info_icon'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_icon.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_icon.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_icon.ggCurrentLogicStateScaling == 0) {
					me._ht_info_icon.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_info_icon.userData.transitions.length; i++) {
						if (me._ht_info_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_icon.userData.transitions[i].interval);
							me._ht_info_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_icon.scale.set(transition_scale.startScale.x + (me._ht_info_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_icon.position.x = (me._ht_info_icon.position.x - me._ht_info_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_info_icon.userData.curScaleOffX = scaleOffX;
							me._ht_info_icon.position.y = (me._ht_info_icon.position.y - me._ht_info_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_info_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_icon.userData.transitions.splice(me._ht_info_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_icon.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_info_icon.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_icon.userData.transitions.length; i++) {
						if (me._ht_info_icon.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_icon.userData.transitions[i].interval);
							me._ht_info_icon.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_icon.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_icon.scale.set(transition_scale.startScale.x + (me._ht_info_icon.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_icon.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_icon.position.x = (me._ht_info_icon.position.x - me._ht_info_icon.userData.curScaleOffX) + scaleOffX;
							me._ht_info_icon.userData.curScaleOffX = scaleOffX;
							me._ht_info_icon.position.y = (me._ht_info_icon.position.y - me._ht_info_icon.userData.curScaleOffY) + scaleOffY;
							me._ht_info_icon.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_icon.userData.transitions.splice(me._ht_info_icon.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_icon.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_info_icon.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_info_hotspots') !== null) && (player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1)) || 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_icon.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_icon.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_icon.ggCurrentLogicStateVisible == 0) {
			me._ht_info_icon.visible=false;
			player.repaint();
			me._ht_info_icon.userData.visible=false;
				}
				else {
			me._ht_info_icon.visible=((!me._ht_info_icon.material && Number(me._ht_info_icon.userData.opacity>0)) || (me._ht_info_icon.material && Number(me._ht_info_icon.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_icon.userData.visible=true;
				}
			}
		}
		me._ht_info_icon.userData.onclick=function (e) {
			player.setVariableValue('vis_info_hotspots', player.getVariableValue('vis_info_hotspots') + "<"+me.hotspot.id+">");
		}
		me._ht_info_icon.userData.hasOwnClickAction = true;
		me._ht_info_icon.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_info_icon']=true;
			me._ht_info_tooltip.logicBlock_visible();
			me._ht_info_icon.logicBlock_scaling();
		}
		me._ht_info_icon.userData.ontouchend=function (e) {
			me._ht_info_icon.logicBlock_scaling();
		}
		me._ht_info_icon.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_info_icon']=false;
			me._ht_info_tooltip.logicBlock_visible();
			me._ht_info_icon.logicBlock_scaling();
		}
		me._ht_info_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_tooltip_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.415);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 22;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_tooltip';
		el.userData.x = 0;
		el.userData.y = -0.415;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_info_tooltip.visible
			let parentEl = me._ht_info_tooltip.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_tooltip.userData.opacity = v;
			v = v * me._ht_info_tooltip.userData.parentOpacity;
			if (me._ht_info_tooltip.userData.setOpacityInternal) me._ht_info_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_tooltip.children.length; i++) {
				let child = me._ht_info_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_tooltip.userData.parentOpacity = v;
			v = v * me._ht_info_tooltip.userData.opacity
			if (me._ht_info_tooltip.userData.setOpacityInternal) me._ht_info_tooltip.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_tooltip.children.length; i++) {
				let child = me._ht_info_tooltip.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_tooltip = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_tooltip;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_tooltip);
			if (skin.rectHasRoundedCorners(me._ht_info_tooltip)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_tooltip.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_tooltip.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_tooltip.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_tooltip.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_info_tooltip_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_info_tooltip_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_tooltip.userData.backgroundColorAlpha = 0.784314;
		me._ht_info_tooltip.userData.borderColorAlpha = 1;
		me._ht_info_tooltip.userData.setOpacityInternal = function(v) {
			me._ht_info_tooltip.material.opacity = v;
			if (me._ht_info_tooltip.userData.hasScrollbar) {
				me._ht_info_tooltip.userData.scrollbar.material.opacity = v;
				me._ht_info_tooltip.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_tooltip.userData.ggSubElement) {
				me._ht_info_tooltip.userData.ggSubElement.material.opacity = v
				me._ht_info_tooltip.userData.ggSubElement.visible = (v>0 && me._ht_info_tooltip.userData.visible);
			}
			me._ht_info_tooltip.visible = (v>0 && me._ht_info_tooltip.userData.visible);
		}
		me._ht_info_tooltip.userData.setBackgroundColor = function(v) {
			me._ht_info_tooltip.material.color = v;
		}
		me._ht_info_tooltip.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_tooltip.userData.backgroundColorAlpha = v;
			me._ht_info_tooltip.userData.setOpacity(me._ht_info_tooltip.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 44;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_info_tooltip;
			var canv = me._ht_info_tooltip.userData.textCanvas;
			var ctx = me._ht_info_tooltip.userData.textCanvasContext;
			var tmpCanv = me._ht_info_tooltip.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_tooltip.userData.backgroundColor.r * 255 + ', ' + me._ht_info_tooltip.userData.backgroundColor.g * 255 + ', ' + me._ht_info_tooltip.userData.backgroundColor.b * 255 + ', ' + me._ht_info_tooltip.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_info_tooltip.userData.scrollPosPercent ? tmpCanv.height * me._ht_info_tooltip.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_info_tooltip.userData.boxWidthCanv / 100.0;
		height = me._ht_info_tooltip.userData.boxHeightCanv / 100.0;
		me._ht_info_tooltip.userData.width = me._ht_info_tooltip.userData.boxWidthCanv;
		me._ht_info_tooltip.userData.height = me._ht_info_tooltip.userData.boxHeightCanv;
		me._ht_info_tooltip.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_info_tooltip, 0, -30);
		me._ht_info_tooltip.position.x = newPos.x;
		me._ht_info_tooltip.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_tooltip_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_tooltip.material.map) {
				me._ht_info_tooltip.material.map.dispose();
			}
			me._ht_info_tooltip.material.map = textTexture;
			me._ht_info_tooltip.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_info_tooltip, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_info_tooltip, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: center; white-space: pre; padding: 5px; overflow: hidden;' + '; color: ' + me._ht_info_tooltip.userData.textColor + ' !important;', false, true, false);
			me._ht_info_tooltip.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_tooltip.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_tooltip.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_tooltip.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_tooltip.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_tooltip";
		me._ht_info_tooltip.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_tooltip.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_info_icon'] == true)) && 
				((player._(me.hotspot.title) != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_tooltip.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_tooltip.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_tooltip.ggCurrentLogicStateVisible == 0) {
			me._ht_info_tooltip.visible=((!me._ht_info_tooltip.material && Number(me._ht_info_tooltip.userData.opacity>0)) || (me._ht_info_tooltip.material && Number(me._ht_info_tooltip.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_tooltip.userData.visible=true;
				}
				else {
			me._ht_info_tooltip.visible=false;
			player.repaint();
			me._ht_info_tooltip.userData.visible=false;
				}
			}
		}
		me._ht_info_tooltip.userData.ggUpdatePosition=function (useTransition) {
				me._ht_info_tooltip.userData.ggUpdateText(true);
		}
		me._ht_info_icon.add(me._ht_info_tooltip);
		me._ht_info.add(me._ht_info_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#00aaff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(1.782);
		el.scale.set(1.00, 0.01, 1.0);
		el.userData.width = 360;
		el.userData.height = 360;
		el.userData.scale = {x: 1.00, y: 0.01, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 1.782;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.020);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._ht_info_bg.visible
			let parentEl = me._ht_info_bg.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_bg.userData.opacity = v;
			v = v * me._ht_info_bg.userData.parentOpacity;
			if (me._ht_info_bg.userData.setOpacityInternal) me._ht_info_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_bg.children.length; i++) {
				let child = me._ht_info_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_bg.userData.parentOpacity = v;
			v = v * me._ht_info_bg.userData.opacity
			if (me._ht_info_bg.userData.setOpacityInternal) me._ht_info_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_bg.children.length; i++) {
				let child = me._ht_info_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_bg;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_bg);
			if (skin.rectHasRoundedCorners(me._ht_info_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_info_bg_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_info_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_bg.userData.backgroundColorAlpha = 0.784314;
		me._ht_info_bg.userData.borderColorAlpha = 1;
		me._ht_info_bg.userData.setOpacityInternal = function(v) {
			me._ht_info_bg.material.opacity = v * me._ht_info_bg.userData.backgroundColorAlpha;
			if (me._ht_info_bg.userData.ggSubElement) {
				me._ht_info_bg.userData.ggSubElement.material.opacity = v
				me._ht_info_bg.userData.ggSubElement.visible = (v>0 && me._ht_info_bg.userData.visible);
			}
			me._ht_info_bg.visible = (v>0 && me._ht_info_bg.userData.visible);
		}
		me._ht_info_bg.userData.setBackgroundColor = function(v) {
			me._ht_info_bg.material.color = v;
		}
		me._ht_info_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_bg.userData.backgroundColorAlpha = v;
			me._ht_info_bg.userData.setOpacity(me._ht_info_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.ggId="ht_info_bg";
		me._ht_info_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('vis_info_hotspots') !== null) && (player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_info_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_bg.scale.set(transition_scale.startScale.x + (me._ht_info_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_bg.position.x = (me._ht_info_bg.position.x - me._ht_info_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_info_bg.userData.curScaleOffX = scaleOffX;
							me._ht_info_bg.position.y = (me._ht_info_bg.position.y - me._ht_info_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_info_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_info_bg.userData.transitionValue_scale = {x: 1, y: 0.01, z: 1.0};
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_bg.scale.set(transition_scale.startScale.x + (me._ht_info_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_bg.position.x = (me._ht_info_bg.position.x - me._ht_info_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_info_bg.userData.curScaleOffX = scaleOffX;
							me._ht_info_bg.position.y = (me._ht_info_bg.position.y - me._ht_info_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_info_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_info_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_info_hotspots') !== null) && (player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_bg.material ? me._ht_info_bg.material.opacity : me._ht_info_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_info_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_bg.userData.transitions.length; i++) {
						if (me._ht_info_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_bg.userData.transitions[i].interval);
							me._ht_info_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_bg.material ? me._ht_info_bg.material.opacity : me._ht_info_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_bg.userData.transitions.splice(me._ht_info_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_info_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_text_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.15);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 310;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_text';
		el.userData.x = 0;
		el.userData.y = -0.15;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_info_text.visible
			let parentEl = me._ht_info_text.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_text.userData.opacity = v;
			v = v * me._ht_info_text.userData.parentOpacity;
			if (me._ht_info_text.userData.setOpacityInternal) me._ht_info_text.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_text.children.length; i++) {
				let child = me._ht_info_text.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_text.userData.parentOpacity = v;
			v = v * me._ht_info_text.userData.opacity
			if (me._ht_info_text.userData.setOpacityInternal) me._ht_info_text.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_text.children.length; i++) {
				let child = me._ht_info_text.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_text = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_text;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_text);
			if (skin.rectHasRoundedCorners(me._ht_info_text)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_text.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_text.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_text.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_text.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_info_text_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_info_text_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_text.userData.backgroundColorAlpha = 0.0392157;
		me._ht_info_text.userData.borderColorAlpha = 1;
		me._ht_info_text.userData.setOpacityInternal = function(v) {
			me._ht_info_text.material.opacity = v;
			if (me._ht_info_text.userData.hasScrollbar) {
				me._ht_info_text.userData.scrollbar.material.opacity = v;
				me._ht_info_text.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_text.userData.ggSubElement) {
				me._ht_info_text.userData.ggSubElement.material.opacity = v
				me._ht_info_text.userData.ggSubElement.visible = (v>0 && me._ht_info_text.userData.visible);
			}
			me._ht_info_text.visible = (v>0 && me._ht_info_text.userData.visible);
		}
		me._ht_info_text.userData.setBackgroundColor = function(v) {
			me._ht_info_text.material.color = v;
		}
		me._ht_info_text.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_text.userData.backgroundColorAlpha = v;
			me._ht_info_text.userData.setOpacity(me._ht_info_text.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 680;
		canvas.height = 620;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_info_text;
			var canv = me._ht_info_text.userData.textCanvas;
			var ctx = me._ht_info_text.userData.textCanvasContext;
			var tmpCanv = me._ht_info_text.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_text.userData.backgroundColor.r * 255 + ', ' + me._ht_info_text.userData.backgroundColor.g * 255 + ', ' + me._ht_info_text.userData.backgroundColor.b * 255 + ', ' + me._ht_info_text.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_info_text.userData.scrollPosPercent ? tmpCanv.height * me._ht_info_text.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_text_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_text.material.map) {
				me._ht_info_text.material.map.dispose();
			}
			me._ht_info_text.material.map = textTexture;
			me._ht_info_text.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_info_text, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_info_text, 'box-sizing: border-box; width: 340px; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: left; white-space: pre-line; padding: 0px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._ht_info_text.userData.textColor + ' !important;', false, false, true, true);
			if (me._ht_info_text.userData.totalHeightCanv > (me._ht_info_text.userData.height)) {
				skin.paintTextDivToCanvas(me._ht_info_text, 'box-sizing: border-box; width: 320px; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: left; white-space: pre-line; padding: 0px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._ht_info_text.userData.textColor + ' !important;', false, false, true);
			} else {
			skin.paintTextDivToCanvas(me._ht_info_text, 'box-sizing: border-box; width: 340px; height: auto; font-size: 18px; font-weight: inherit; color: rgba(255,255,255,1); text-align: left; white-space: pre-line; padding: 0px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._ht_info_text.userData.textColor + ' !important;', false, false, true);
			}
			me._ht_info_text.userData.scrollPosPercent = 0.0
			if (me._ht_info_text.userData.totalHeightCanv > ((me._ht_info_text.userData.height))) {
				me._ht_info_text.userData.pagePercent = ((me._ht_info_text.userData.height) - me._ht_info_text.userData.lineHeight) / me._ht_info_text.userData.totalHeightCanv;
				me._ht_info_text.userData.maxScrollPercent = (me._ht_info_text.userData.totalHeightCanv - (1 * (me._ht_info_text.userData.height))) / me._ht_info_text.userData.totalHeightCanv;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_text.userData.height / 100.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarBgGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x7f7f7f, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarBgMaterial';
				me._ht_info_text.userData.scrollbarBg = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbarBg.name = 'ht_info_text_scrollbarBg';
				me._ht_info_text.add(me._ht_info_text.userData.scrollbarBg);
				me._ht_info_text.userData.scrollbarXPos = (me._ht_info_text.userData.width - 20) / 200.0;
				me._ht_info_text.userData.scrollbarBg.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbarBg.position.z = me._ht_info_text.position.z + 0.01;
				me._ht_info_text.userData.scrollbarBg.userData.stopPropagation = true;
				me._ht_info_text.userData.scrollbarHeight = ((1 * me._ht_info_text.userData.height) / me._ht_info_text.userData.totalHeightCanv) * me._ht_info_text.userData.height;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_text.userData.scrollbarHeight / 100.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0xbfbfbf, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarMaterial';
				me._ht_info_text.userData.scrollbar = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbar.name = 'ht_info_text_scrollbar';
				me._ht_info_text.add(me._ht_info_text.userData.scrollbar);
				me._ht_info_text.userData.scrollbar.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbar.position.z = me._ht_info_text.position.z + 0.02;
				me._ht_info_text.userData.scrollbarYPosMin = (me._ht_info_text.userData.height - me._ht_info_text.userData.scrollbarHeight) / 200.0;
				me._ht_info_text.userData.scrollbarYPosMax = me._ht_info_text.userData.scrollbarYPosMin - (me._ht_info_text.userData.height - me._ht_info_text.userData.scrollbarHeight) / 100.0;
				me._ht_info_text.userData.scrollbar.position.y = me._ht_info_text.userData.scrollbarYPosMin;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_text.userData.height / 200.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarPageDownGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarPageDownMaterial';
				me._ht_info_text.userData.scrollbarPageDown = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbarPageDown.name = 'ht_info_text_scrollbarPageDown';
				me._ht_info_text.userData.scrollbarPageDown.userData.onclick = function() {
					me._ht_info_text.userData.scrollPosPercent -= me._ht_info_text.userData.pagePercent;
					me._ht_info_text.userData.scrollPosPercent = Math.max(me._ht_info_text.userData.scrollPosPercent, 0);
					me._ht_info_text.userData.ggTextureFromCanvas();
					me._ht_info_text.userData.scrollbar.position.y += (me._ht_info_text.userData.height * me._ht_info_text.userData.pagePercent) / 100.0;
					me._ht_info_text.userData.scrollbar.position.y = Math.min(me._ht_info_text.userData.scrollbar.position.y, me._ht_info_text.userData.scrollbarYPosMin);
				}
				me._ht_info_text.userData.scrollbarPageDown.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbarPageDown.position.y = me._ht_info_text.userData.height / 400.0;
				me._ht_info_text.userData.scrollbarPageDown.position.z = me._ht_info_text.position.z + 0.05;
				me._ht_info_text.userData.scrollbarPageDown.userData.stopPropagation = true;
				me._ht_info_text.userData.scrollbarPageDown.userData.clickInvisible = true;
				me._ht_info_text.userData.scrollbarPageDown.visible = false;
				me._ht_info_text.add(me._ht_info_text.userData.scrollbarPageDown);
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_text.userData.height / 200.0, 5, 5 );
				geometry.name = 'ht_info_text_scrollbarPageUpGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_text_scrollbarPageUpMaterial';
				me._ht_info_text.userData.scrollbarPageUp = new THREE.Mesh( geometry, material );
				me._ht_info_text.userData.scrollbarPageUp.name = 'ht_info_text_scrollbarPageUp';
				me._ht_info_text.userData.scrollbarPageUp.userData.onclick = function() {
					me._ht_info_text.userData.scrollPosPercent += me._ht_info_text.userData.pagePercent;
					me._ht_info_text.userData.scrollPosPercent = Math.min(me._ht_info_text.userData.scrollPosPercent, me._ht_info_text.userData.maxScrollPercent);
					me._ht_info_text.userData.ggTextureFromCanvas();
					me._ht_info_text.userData.scrollbar.position.y -= (me._ht_info_text.userData.height * me._ht_info_text.userData.pagePercent) / 100.0;
					me._ht_info_text.userData.scrollbar.position.y = Math.max(me._ht_info_text.userData.scrollbar.position.y, me._ht_info_text.userData.scrollbarYPosMax);
				}
				me._ht_info_text.userData.scrollbarPageUp.position.x = me._ht_info_text.userData.scrollbarXPos;
				me._ht_info_text.userData.scrollbarPageUp.position.y = -me._ht_info_text.userData.height / 400.0;
				me._ht_info_text.userData.scrollbarPageUp.position.z = me._ht_info_text.position.z + 0.05;
				me._ht_info_text.userData.scrollbarPageUp.userData.stopPropagation = true;
				me._ht_info_text.userData.scrollbarPageUp.userData.clickInvisible = true;
				me._ht_info_text.userData.scrollbarPageUp.visible = false;
				me._ht_info_text.add(me._ht_info_text.userData.scrollbarPageUp);
				me._ht_info_text.userData.hasScrollbar = true;
			} else {
				me._ht_info_text.userData.hasScrollbar = false;
			}
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.description))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_text.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_text.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_text.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_text.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_text";
		me._ht_info_text.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_text.userData.ggUpdatePosition=function (useTransition) {
				me._ht_info_text.userData.ggUpdateText(true);
		}
		me._ht_info_bg.add(me._ht_info_text);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(1.565);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 25;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_title';
		el.userData.x = 0;
		el.userData.y = 1.565;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_info_title.visible
			let parentEl = me._ht_info_title.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_title.userData.opacity = v;
			v = v * me._ht_info_title.userData.parentOpacity;
			if (me._ht_info_title.userData.setOpacityInternal) me._ht_info_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_title.children.length; i++) {
				let child = me._ht_info_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_title.userData.parentOpacity = v;
			v = v * me._ht_info_title.userData.opacity
			if (me._ht_info_title.userData.setOpacityInternal) me._ht_info_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_title.children.length; i++) {
				let child = me._ht_info_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_title = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_title;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_title);
			if (skin.rectHasRoundedCorners(me._ht_info_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'ht_info_title_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'ht_info_title_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_title.userData.backgroundColorAlpha = 0.0392157;
		me._ht_info_title.userData.borderColorAlpha = 1;
		me._ht_info_title.userData.setOpacityInternal = function(v) {
			me._ht_info_title.material.opacity = v;
			if (me._ht_info_title.userData.hasScrollbar) {
				me._ht_info_title.userData.scrollbar.material.opacity = v;
				me._ht_info_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_title.userData.ggSubElement) {
				me._ht_info_title.userData.ggSubElement.material.opacity = v
				me._ht_info_title.userData.ggSubElement.visible = (v>0 && me._ht_info_title.userData.visible);
			}
			me._ht_info_title.visible = (v>0 && me._ht_info_title.userData.visible);
		}
		me._ht_info_title.userData.setBackgroundColor = function(v) {
			me._ht_info_title.material.color = v;
		}
		me._ht_info_title.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_title.userData.backgroundColorAlpha = v;
			me._ht_info_title.userData.setOpacity(me._ht_info_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 680;
		canvas.height = 50;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_info_title;
			var canv = me._ht_info_title.userData.textCanvas;
			var ctx = me._ht_info_title.userData.textCanvasContext;
			var tmpCanv = me._ht_info_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_title.userData.backgroundColor.r * 255 + ', ' + me._ht_info_title.userData.backgroundColor.g * 255 + ', ' + me._ht_info_title.userData.backgroundColor.b * 255 + ', ' + me._ht_info_title.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_info_title.userData.scrollPosPercent ? tmpCanv.height * me._ht_info_title.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_title.material.map) {
				me._ht_info_title.material.map.dispose();
			}
			me._ht_info_title.material.map = textTexture;
			me._ht_info_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_info_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_info_title, 'box-sizing: border-box; width: 340px; height: auto; font-size: 22px; font-weight: inherit; color: rgba(255,255,255,1); text-align: center; white-space: nowrap; padding: 0px; overflow: hidden; text-overflow: ellipsis;' + '; color: ' + me._ht_info_title.userData.textColor + ' !important;', false, false, false);
			me._ht_info_title.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(player._(me.hotspot.title))));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._ht_info_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_title";
		me._ht_info_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_title.userData.ggUpdatePosition=function (useTransition) {
				me._ht_info_title.userData.ggUpdateText(true);
		}
		me._ht_info_bg.add(me._ht_info_title);
		me._ht_info.add(me._ht_info_bg);
		el = new THREE.Group();
		el.userData.setOpacityInState = function(stateGroup, opacity) {
			stateGroup.traverse(function(child) {
				if (child.material) {
					child.material.opacity = child.userData.svgOpacity * opacity;
					child.material.transparent = player.get3dModelType() != 2 || (child.material.opacity < 1.0);
				}
			});
		}
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_info_close.userData.svgGroupNormal) me._ht_info_close.userData.setOpacityInState(me._ht_info_close.userData.svgGroupNormal, v);
			if (me._ht_info_close.userData.svgGroupOver) me._ht_info_close.userData.setOpacityInState(me._ht_info_close.userData.svgGroupOver, v);
			if (me._ht_info_close.userData.svgGroupActive) me._ht_info_close.userData.setOpacityInState(me._ht_info_close.userData.svgGroupActive, v);
			me._ht_info_close.visible = (v>0 && me._ht_info_close.userData.visible);
		}
		el.translateX(2.1);
		el.translateY(1.575);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 45;
		el.userData.height = 45;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_close';
		el.userData.x = 2.1;
		el.userData.y = 1.575;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_info_close.visible
			let parentEl = me._ht_info_close.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_close.userData.opacity = v;
			v = v * me._ht_info_close.userData.parentOpacity;
			if (me._ht_info_close.userData.setOpacityInternal) me._ht_info_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_close.children.length; i++) {
				let child = me._ht_info_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_close.userData.parentOpacity = v;
			v = v * me._ht_info_close.userData.opacity
			if (me._ht_info_close.userData.setOpacityInternal) me._ht_info_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_close.children.length; i++) {
				let child = me._ht_info_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(45 / 100.0, 45 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_info_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_info_close_clickTargetMaterial';
		me._ht_info_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_info_close.userData.clickTarget.name = 'ht_info_close_clickTarget';
		me._ht_info_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_info_close.userData.clickTarget.visible = false;
		me._ht_info_close.add(me._ht_info_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_info_close.svg', me._ht_info_close.userData.width / 100.0, me._ht_info_close.userData.height / 100.0);
			me._ht_info_close.add(group);
			me._ht_info_close.userData.svgGroupNormal = group;
			me._ht_info_close.userData.setOpacityInState(group, me._ht_info_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_info_close";
		me._ht_info_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_close.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_info_close'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_close.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_close.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_close.ggCurrentLogicStateScaling == 0) {
					me._ht_info_close.userData.transitionValue_scale = {x: 1.15, y: 1.15, z: 1.0};
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_close.scale.set(transition_scale.startScale.x + (me._ht_info_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_close.position.x = (me._ht_info_close.position.x - me._ht_info_close.userData.curScaleOffX) + scaleOffX;
							me._ht_info_close.userData.curScaleOffX = scaleOffX;
							me._ht_info_close.position.y = (me._ht_info_close.position.y - me._ht_info_close.userData.curScaleOffY) + scaleOffY;
							me._ht_info_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_close.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_info_close.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_close.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 200;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_close.scale.set(transition_scale.startScale.x + (me._ht_info_close.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_close.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_close.position.x = (me._ht_info_close.position.x - me._ht_info_close.userData.curScaleOffX) + scaleOffX;
							me._ht_info_close.userData.curScaleOffX = scaleOffX;
							me._ht_info_close.position.y = (me._ht_info_close.position.y - me._ht_info_close.userData.curScaleOffY) + scaleOffY;
							me._ht_info_close.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_close.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_info_close.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('vis_info_hotspots') !== null) && (player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_close.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_close.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_close.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_close.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_close.material ? me._ht_info_close.material.opacity : me._ht_info_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_close.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_info_close.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_close.userData.transitions.length; i++) {
						if (me._ht_info_close.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_close.userData.transitions[i].interval);
							me._ht_info_close.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_close.material ? me._ht_info_close.material.opacity : me._ht_info_close.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_close.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_close.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_close.userData.transitions.splice(me._ht_info_close.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_close.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_info_close.userData.onclick=function (e) {
			player.setVariableValue('vis_info_hotspots', player.getVariableValue('vis_info_hotspots').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_info_close.userData.hasOwnClickAction = true;
		me._ht_info_close.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_info_close']=true;
			me._ht_info_close.logicBlock_scaling();
		}
		me._ht_info_close.userData.ontouchend=function (e) {
			me._ht_info_close.logicBlock_scaling();
		}
		me._ht_info_close.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_info_close']=false;
			me._ht_info_close.logicBlock_scaling();
		}
		me._ht_info_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info.add(me._ht_info_close);
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 50;
		el.userData.height = 50;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_CustomImage';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_info_customimage.visible
			let parentEl = me._ht_info_customimage.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_info_customimage.userData.opacity = v;
			v = v * me._ht_info_customimage.userData.parentOpacity;
			if (me._ht_info_customimage.userData.setOpacityInternal) me._ht_info_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_customimage.children.length; i++) {
				let child = me._ht_info_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_customimage.userData.parentOpacity = v;
			v = v * me._ht_info_customimage.userData.opacity
			if (me._ht_info_customimage.userData.setOpacityInternal) me._ht_info_customimage.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_customimage.children.length; i++) {
				let child = me._ht_info_customimage.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_customimage = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_customimage;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_customimage);
		}
		me._ht_info_customimage.userData.backgroundColorAlpha = 1;
		me._ht_info_customimage.userData.borderColorAlpha = 1;
		me._ht_info_customimage.userData.setOpacityInternal = function(v) {
			if (me._ht_info_customimage.userData.ggSubElement) {
				me._ht_info_customimage.userData.ggSubElement.material.opacity = v
				me._ht_info_customimage.userData.ggSubElement.visible = (v>0 && me._ht_info_customimage.userData.visible);
			}
			me._ht_info_customimage.visible = (v>0 && me._ht_info_customimage.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 50;
		currentHeight = 50;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'ht_info_CustomImage_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_info_customimage.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_info_customimage.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_info_CustomImage_subElementMaterial';
				me._ht_info_customimage.userData.ggSubElement.material = loadedMaterial;
				me._ht_info_customimage.userData.ggUpdatePosition();
				me._ht_info_customimage.userData.ggText = extUrl;
				me._ht_info_customimage.userData.setOpacity(me._ht_info_customimage.userData.opacity);
			});
		};
		if ((hotspot) && (hotspot.customimage)) {
			var extUrl=hotspot.customimage;
		}
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_info_CustomImage_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_info_CustomImage_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 50;
		el.userData.clientHeight = 50;
		el.userData.ggId="ht_info_CustomImage";
		me._ht_info_customimage.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_customimage.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('vis_info_hotspots') !== null) && (player.getVariableValue('vis_info_hotspots')).indexOf("<"+me.hotspot.id+">") == -1)) && 
				((me.hotspot.customimage != ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_customimage.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_customimage.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_customimage.ggCurrentLogicStateVisible == 0) {
			me._ht_info_customimage.visible=((!me._ht_info_customimage.material && Number(me._ht_info_customimage.userData.opacity>0)) || (me._ht_info_customimage.material && Number(me._ht_info_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_customimage.userData.visible=true;
				}
				else {
			me._ht_info_customimage.visible=false;
			player.repaint();
			me._ht_info_customimage.userData.visible=false;
				}
			}
		}
		me._ht_info_customimage.userData.onclick=function (e) {
			player.setVariableValue('vis_info_hotspots', player.getVariableValue('vis_info_hotspots') + "<"+me.hotspot.id+">");
		}
		me._ht_info_customimage.userData.hasOwnClickAction = true;
		me._ht_info_customimage.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_info_customimage.userData.clientWidth;
			var parentHeight = me._ht_info_customimage.userData.clientHeight;
			var img = me._ht_info_customimage.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			if (imgWidth < parentWidth) parentWidth = imgWidth;
			if (imgHeight < parentHeight) parentHeight = imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if ((hotspot) && (hotspot.customimage)) {
				currentWidth  = hotspot.customimagewidth;
				currentHeight = hotspot.customimageheight;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'ht_info_CustomImage_imgGeometry';
			}
		}
		me._ht_info.add(me._ht_info_customimage);
		me._ht_info.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info.traverse((obj)=>{
				if (me._ht_info.material) {
					me._ht_info.material.transparent = (me._ht_info.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_info']=false;
		me._ht_info_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_icon.traverse((obj)=>{
				if (me._ht_info_icon.material) {
					me._ht_info_icon.material.transparent = (me._ht_info_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_info_icon']=false;
		me._ht_info_icon.logicBlock_scaling();
		me._ht_info_icon.logicBlock_visible();
		me._ht_info_tooltip.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_tooltip.traverse((obj)=>{
				if (me._ht_info_tooltip.material) {
					me._ht_info_tooltip.material.transparent = (me._ht_info_tooltip.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_info_tooltip.userData.ggUpdateText(true);
		me._ht_info_tooltip.logicBlock_visible();
		me._ht_info_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_bg.traverse((obj)=>{
				if (me._ht_info_bg.material) {
					me._ht_info_bg.material.transparent = (me._ht_info_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_info_bg.logicBlock_scaling();
		me._ht_info_bg.logicBlock_alpha();
		me._ht_info_text.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_text.traverse((obj)=>{
				if (me._ht_info_text.material) {
					me._ht_info_text.material.transparent = (me._ht_info_text.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_info_text.userData.ggUpdateText(true);
		me._ht_info_title.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_title.traverse((obj)=>{
				if (me._ht_info_title.material) {
					me._ht_info_title.material.transparent = (me._ht_info_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_info_title.userData.ggUpdateText(true);
		me._ht_info_close.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_close.traverse((obj)=>{
				if (me._ht_info_close.material) {
					me._ht_info_close.material.transparent = (me._ht_info_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_info_close']=false;
		me._ht_info_close.logicBlock_scaling();
		me._ht_info_close.logicBlock_alpha();
		me._ht_info_customimage.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_customimage.traverse((obj)=>{
				if (me._ht_info_customimage.material) {
					me._ht_info_customimage.material.transparent = (me._ht_info_customimage.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_info_customimage.logicBlock_visible();
			me.ggEvent_activehotspotchanged=function() {
				me._ht_info_icon.logicBlock_visible();
				me._ht_info_tooltip.logicBlock_visible();
				me._ht_info_customimage.logicBlock_visible();
			};
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_info.traverse((obj)=>{
						if (me._ht_info.material) {
							me._ht_info.material.transparent = (me._ht_info.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_info_icon.traverse((obj)=>{
						if (me._ht_info_icon.material) {
							me._ht_info_icon.material.transparent = (me._ht_info_icon.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_icon.logicBlock_visible();
					me._ht_info_tooltip.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_info_tooltip.traverse((obj)=>{
						if (me._ht_info_tooltip.material) {
							me._ht_info_tooltip.material.transparent = (me._ht_info_tooltip.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_tooltip.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_info_bg.traverse((obj)=>{
						if (me._ht_info_bg.material) {
							me._ht_info_bg.material.transparent = (me._ht_info_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_bg.logicBlock_scaling();
				me._ht_info_bg.logicBlock_alpha();
					me._ht_info_text.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_info_text.traverse((obj)=>{
						if (me._ht_info_text.material) {
							me._ht_info_text.material.transparent = (me._ht_info_text.userData.zIndexCurrent > 0);
							}
					});
				}
					me._ht_info_title.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_info_title.traverse((obj)=>{
						if (me._ht_info_title.material) {
							me._ht_info_title.material.transparent = (me._ht_info_title.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_info_close.traverse((obj)=>{
						if (me._ht_info_close.material) {
							me._ht_info_close.material.transparent = (me._ht_info_close.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_close.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_info_customimage.traverse((obj)=>{
						if (me._ht_info_customimage.material) {
							me._ht_info_customimage.material.transparent = (me._ht_info_customimage.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_customimage.logicBlock_visible();
			};
			me.ggEvent_configloaded=function() {
				me._ht_info_icon.logicBlock_visible();
				me._ht_info_tooltip.logicBlock_visible();
				me._ht_info_bg.logicBlock_scaling();
				me._ht_info_bg.logicBlock_alpha();
				me._ht_info_close.logicBlock_alpha();
				me._ht_info_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_vis_info_hotspots=function() {
				me._ht_info_icon.logicBlock_visible();
				me._ht_info_bg.logicBlock_scaling();
				me._ht_info_bg.logicBlock_alpha();
				me._ht_info_close.logicBlock_alpha();
				me._ht_info_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_info;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_pdf__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_pdf.visible = (v>0 && me._ht_pdf.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_pdf';
		el.userData.x = -3.9;
		el.userData.y = 2.9;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_pdf.visible
			let parentEl = me._ht_pdf.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_pdf.userData.opacity = v;
			v = v * me._ht_pdf.userData.parentOpacity;
			if (me._ht_pdf.userData.setOpacityInternal) me._ht_pdf.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_pdf.children.length; i++) {
				let child = me._ht_pdf.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_pdf.userData.parentOpacity = v;
			v = v * me._ht_pdf.userData.opacity
			if (me._ht_pdf.userData.setOpacityInternal) me._ht_pdf.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_pdf.children.length; i++) {
				let child = me._ht_pdf.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_pdf = el;
		el.userData.ggId="ht_pdf";
		me._ht_pdf.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_pdf.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_pdf']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_pdf.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_pdf']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_pdf.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_pdf.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_pdf.traverse((obj)=>{
				if (me._ht_pdf.material) {
					me._ht_pdf.material.transparent = (me._ht_pdf.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_pdf']=false;
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_pdf.traverse((obj)=>{
						if (me._ht_pdf.material) {
							me._ht_pdf.material.transparent = (me._ht_pdf.userData.zIndexCurrent > 0);
							}
					});
				}
			};
			me.__obj = me._ht_pdf;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_video_youtube__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_youtube.visible = (v>0 && me._ht_video_youtube.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_video_youtube';
		el.userData.x = -3.9;
		el.userData.y = 2.9;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_youtube.visible
			let parentEl = me._ht_video_youtube.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_youtube.userData.opacity = v;
			v = v * me._ht_video_youtube.userData.parentOpacity;
			if (me._ht_video_youtube.userData.setOpacityInternal) me._ht_video_youtube.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_youtube.children.length; i++) {
				let child = me._ht_video_youtube.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_youtube.userData.parentOpacity = v;
			v = v * me._ht_video_youtube.userData.opacity
			if (me._ht_video_youtube.userData.setOpacityInternal) me._ht_video_youtube.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_youtube.children.length; i++) {
				let child = me._ht_video_youtube.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_youtube = el;
		el.userData.ggId="ht_video_youtube";
		me._ht_video_youtube.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_video_youtube.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_youtube.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_youtube.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_video_youtube']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_youtube.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_youtube']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_video_youtube.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_youtube.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_youtube.traverse((obj)=>{
				if (me._ht_video_youtube.material) {
					me._ht_video_youtube.material.transparent = (me._ht_video_youtube.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_youtube']=false;
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_video_youtube.traverse((obj)=>{
						if (me._ht_video_youtube.material) {
							me._ht_video_youtube.material.transparent = (me._ht_video_youtube.userData.zIndexCurrent > 0);
							}
					});
				}
			};
			me.__obj = me._ht_video_youtube;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinHotspotClass_ht_video_vimeo__3d(parentScope,hotspot) {
		var me=this;
		var flag=false;
		var hs='';
		me.parentScope=parentScope;
		me.hotspot=hotspot;
		var nodeId=String(hotspot.url);
		nodeId=(nodeId.charAt(0)=='{')?nodeId.substr(1, nodeId.length - 2):''; // }
		me.ggUserdata=skin.player.getNodeUserdata(nodeId);
		me.ggUserdata.nodeId=nodeId;
		me.ggNodeId=nodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
		me.findElements=function(id,regex) {
			return skin.findElements(id,regex);
		}
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._ht_video_vimeo.visible = (v>0 && me._ht_video_vimeo.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_video_vimeo';
		el.userData.x = -3.9;
		el.userData.y = 2.9;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_vimeo.visible
			let parentEl = me._ht_video_vimeo.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._ht_video_vimeo.userData.opacity = v;
			v = v * me._ht_video_vimeo.userData.parentOpacity;
			if (me._ht_video_vimeo.userData.setOpacityInternal) me._ht_video_vimeo.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_vimeo.children.length; i++) {
				let child = me._ht_video_vimeo.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_vimeo.userData.parentOpacity = v;
			v = v * me._ht_video_vimeo.userData.opacity
			if (me._ht_video_vimeo.userData.setOpacityInternal) me._ht_video_vimeo.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_vimeo.children.length; i++) {
				let child = me._ht_video_vimeo.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_vimeo = el;
		el.userData.ggId="ht_video_vimeo";
		me._ht_video_vimeo.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			if (me.hotspot.url!='' && me.hotspot.url.charAt(0)=='{') { // }
				return me.hotspot.url.substr(1, me.hotspot.url.length - 2);
			} else {
				if ((this.parentNode) && (this.parentNode.userData.ggElementNodeId)) {
					return this.parentNode.userData.ggElementNodeId();
				} else {
					return player.getCurrentNode();
				}
			}
		}
		me._ht_video_vimeo.userData.onclick=function (e) {
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_vimeo.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_vimeo.userData.onmouseenter=function (e) {
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_video_vimeo']=true;
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_video_vimeo.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_vimeo']=false;
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_video_vimeo.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_vimeo.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_vimeo.traverse((obj)=>{
				if (me._ht_video_vimeo.material) {
					me._ht_video_vimeo.material.transparent = (me._ht_video_vimeo.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_vimeo']=false;
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_video_vimeo.traverse((obj)=>{
						if (me._ht_video_vimeo.material) {
							me._ht_video_vimeo.material.transparent = (me._ht_video_vimeo.userData.zIndexCurrent > 0);
							}
					});
				}
			};
			me.__obj = me._ht_video_vimeo;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
	};
	function SkinCloner_node_cloner_vr_Class(nodeId, parentScope, ggParent, parameter) {
		var me=this;
		me.parentScope=parentScope;
		me.ggParent=ggParent;
		me.findElements=skin.findElements;
		me.ggIndex=parameter.index;
		me.ggNodeId=nodeId;
		me.ggTitle=parameter.title;
		me.ggUserdata=skin.player.getNodeUserdata(me.ggNodeId);
		me.ggUserdata.nodeId=me.ggNodeId;
		me.elementMouseDown={};
		me.elementMouseOver={};
			me.__obj = new THREE.Group;
			me.__obj.name = 'node_cloner_vr_subElement';
			me.__obj.position.x = parameter.left;
			me.__obj.position.y = parameter.top;
			me.__obj.userData.ggIsActive = function() {
				return player.getCurrentNode()==me.userData.ggNodeId;
			}
			me.__obj.userData.ggElementNodeId=function() {
				return me.userData.ggNodeId;
			}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'node_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 250;
		el.userData.height = 32;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'node_title';
		el.userData.x = 0;
		el.userData.y = 0.01;
		el.translateZ(0.010);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.010;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 1;
		el.userData.renderOrder = 1;
		el.userData.isVisible = function() {
			let vis = me._node_title.visible
			let parentEl = me._node_title.parent;
			while (vis && parentEl) {
				if (!parentEl.visible) {
					vis = false;
					break;
				}
				parentEl = parentEl.parent;
			}
			return vis;
		}
		el.userData.setOpacity = function(v) {
			me._node_title.userData.opacity = v;
			v = v * me._node_title.userData.parentOpacity;
			if (me._node_title.userData.setOpacityInternal) me._node_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_title.children.length; i++) {
				let child = me._node_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._node_title.userData.parentOpacity = v;
			v = v * me._node_title.userData.opacity
			if (me._node_title.userData.setOpacityInternal) me._node_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_title.children.length; i++) {
				let child = me._node_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._node_title = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 2;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 0;
		el.userData.borderRadius.default.topRight = 0;
		el.userData.borderRadius.default.bottomRight = 0;
		el.userData.borderRadius.default.bottomLeft = 0;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._node_title;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			if (typeof(bwTop) != 'undefined') {
				el.userData.borderWidth.top = bwTop;
				el.userData.borderWidth.right = bwRight;
				el.userData.borderWidth.bottom = bwBottom;
				el.userData.borderWidth.left = bwLeft;
				el.userData.borderRadius.topLeft = brTopLeft;
				el.userData.borderRadius.topRight = brTopRight;
				el.userData.borderRadius.bottomRight = brBottomRight;
				el.userData.borderRadius.bottomLeft = brBottomLeft;
			}
			let width = el.userData.width / 100.0;
			let height = el.userData.height / 100.0;
			skin.rectCalcBorderRadiiInnerShape(me._node_title);
			if (skin.rectHasRoundedCorners(me._node_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._node_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._node_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._node_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._node_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
		roundedRectShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		roundedRectShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		roundedRectShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		roundedRectShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		roundedRectShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		roundedRectShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		roundedRectShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		roundedRectShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		roundedRectShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		geometry = new THREE.ShapeGeometry(roundedRectShape);
		geometry.name = 'node_title_geometry';
		geometry.computeBoundingBox();
		var min = geometry.boundingBox.min;
		var max = geometry.boundingBox.max;
		var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		var vertexPositions = geometry.getAttribute('position');
		var vertexUVs = geometry.getAttribute('uv');
		for (var i = 0; i < vertexPositions.count; i++) {
			var v1 = vertexPositions.getX(i);
			var	v2 = vertexPositions.getY(i);
			vertexUVs.setX(i, (v1 + offset.x) / range.x);
			vertexUVs.setY(i, (v2 + offset.y) / range.y);
		}
		geometry.uvsNeedUpdate = true;
			} else {
				geometry = new THREE.PlaneGeometry(el.userData.width / 100.0, el.userData.height / 100.0, 5, 5);
				geometry.name = 'node_title_geometry';
			}
			el.geometry = geometry;
			el.userData.borderRadiusInnerShape = {};
		let bWidthLeft = me._node_title.userData.borderWidth.left / 100.0;
		let bWidthTop = me._node_title.userData.borderWidth.top / 100.0;
		let bWidthRight = me._node_title.userData.borderWidth.right / 100.0;
		let bWidthBottom = me._node_title.userData.borderWidth.bottom / 100.0;
		let maxRad = skin.rectMaxRadius(me._node_title);
		let bRadiusTL = Math.min(me._node_title.userData.borderRadius.topLeft / 100.0, maxRad / 100.0);
		let bRadiusTR = Math.min(me._node_title.userData.borderRadius.topRight / 100.0, maxRad / 100.0);
		let bRadiusBR = Math.min(me._node_title.userData.borderRadius.bottomRight / 100.0, maxRad / 100.0);
		let bRadiusBL = Math.min(me._node_title.userData.borderRadius.bottomLeft / 100.0, maxRad / 100.0);
		borderShape = new THREE.Shape();
		borderShape.moveTo((-width / 2.0) - bWidthLeft + bRadiusTL, (height / 2.0) + bWidthTop);
		borderShape.lineTo((width / 2.0) + bWidthRight - bRadiusTR, (height / 2.0) + bWidthTop);
		if (bRadiusTR > 0) {
			borderShape.arc(0, -bRadiusTR, bRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		borderShape.lineTo((width / 2.0) + bWidthRight, (-height / 2.0) - bWidthBottom + bRadiusBR);
		if (bRadiusBR > 0) {
			borderShape.arc(-bRadiusBR, 0, bRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft + bRadiusBL, (-height / 2.0) - bWidthBottom);
		if (bRadiusBL > 0) {
			borderShape.arc(0, bRadiusBL, bRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		borderShape.lineTo((-width / 2.0) - bWidthLeft, (height / 2.0) + bWidthTop - bRadiusTL);
		if (bRadiusTL > 0) {
			borderShape.arc(bRadiusTL, 0, bRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		innerShape = new THREE.Path();
		if (skin.rectHasRoundedCorners(me._node_title)) {
			let borderRadiusTL = bRadiusTL - ((bWidthTop + bWidthLeft) / 2.0);
			let borderRadiusTR = bRadiusTR - ((bWidthTop + bWidthRight) / 2.0);
			let borderRadiusBR = bRadiusBR - ((bWidthBottom + bWidthRight) / 2.0);
			let borderRadiusBL = bRadiusBL - ((bWidthBottom + bWidthLeft) / 2.0);
		innerShape.moveTo((-width / 2.0) + borderRadiusTL, (height / 2.0));
		innerShape.lineTo((width / 2.0) - borderRadiusTR, (height / 2.0));
		if (borderRadiusTR > 0.0) {
		innerShape.arc(0, -borderRadiusTR, borderRadiusTR, Math.PI / 2.0, 2.0 * Math.PI, true);
		}
		innerShape.lineTo((width / 2.0), (-height / 2.0) + borderRadiusBR);
		if (borderRadiusBR > 0.0) {
		innerShape.arc(-borderRadiusBR, 0, borderRadiusBR, 2.0 * Math.PI, 3.0 * Math.PI / 2.0, true);
		}
		innerShape.lineTo((-width / 2.0) + borderRadiusBL, (-height / 2.0));
		if (borderRadiusBL > 0.0) {
		innerShape.arc(0, borderRadiusBL, borderRadiusBL, 3.0 * Math.PI / 2.0, Math.PI, true);
		}
		innerShape.lineTo((-width / 2.0), (height / 2.0) - borderRadiusTL);
		if (borderRadiusTL > 0.0) {
		innerShape.arc(borderRadiusTL, 0, borderRadiusTL, Math.PI, Math.PI / 2.0, true);
		}
		} else {
			innerShape.moveTo((-width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (height / 2.0));
			innerShape.lineTo((width / 2.0), (-height / 2.0));
			innerShape.lineTo((-width / 2.0), (-height / 2.0));
		}
		borderShape.holes.push(innerShape);
		borderGeometry = new THREE.ShapeGeometry(borderShape);
		borderGeometry.name = 'node_title_subElement_borderGeometry';
		borderMaterial = new THREE.MeshBasicMaterial( {color: player.getTHREESkinColor('#4d4d4d'), side: THREE.DoubleSide, transparent: (player.get3dModelType() != 2 || false) } );
		borderMaterial.name = 'node_title_subElement_borderMaterial';
		me._node_title.userData.border = new THREE.Mesh( borderGeometry, borderMaterial );
		me._node_title.userData.border.name = 'node_title_subElement_borderMesh';
		me._node_title.add(me._node_title.userData.border);
		}
		me._node_title.userData.backgroundColorAlpha = 0.666667;
		me._node_title.userData.borderColorAlpha = 1;
		me._node_title.userData.setOpacityInternal = function(v) {
			me._node_title.material.opacity = v;
			if (me._node_title.userData.hasScrollbar) {
				me._node_title.userData.scrollbar.material.opacity = v;
				me._node_title.userData.scrollbarBg.material.opacity = v;
			}
			me._node_title.userData.border.material.opacity = v * me._node_title.userData.borderColorAlpha;
			if (me._node_title.userData.ggSubElement) {
				me._node_title.userData.ggSubElement.material.opacity = v
				me._node_title.userData.ggSubElement.visible = (v>0 && me._node_title.userData.visible);
			}
			me._node_title.visible = (v>0 && me._node_title.userData.visible);
		}
		me._node_title.userData.setBackgroundColor = function(v) {
			me._node_title.material.color = v;
		}
		me._node_title.userData.setBackgroundColorAlpha = function(v) {
			me._node_title.userData.backgroundColorAlpha = v;
			me._node_title.userData.setOpacity(me._node_title.userData.opacity);
		}
		me._node_title.userData.setBorderColor = function(v) {
			me._node_title.userData.border.material.color = v;
		}
		me._node_title.userData.setBorderColorAlpha = function(v) {
			me._node_title.userData.borderColorAlpha = v;
			me._node_title.userData.setOpacity(me._node_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 2, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#00aaff');
		el.userData.textColor = '#f3f3f3';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 500;
		canvas.height = 64;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._node_title;
			var canv = me._node_title.userData.textCanvas;
			var ctx = me._node_title.userData.textCanvasContext;
			var tmpCanv = me._node_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._node_title.userData.backgroundColor.r * 255 + ', ' + me._node_title.userData.backgroundColor.g * 255 + ', ' + me._node_title.userData.backgroundColor.b * 255 + ', ' + me._node_title.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, canv.height / 2 - tmpCanv.height / 2);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'node_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._node_title.material.map) {
				me._node_title.material.map.dispose();
			}
			me._node_title.material.map = textTexture;
			me._node_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._node_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._node_title, 'box-sizing: border-box; width: 250px; height: auto; font-size: 20px; font-weight: inherit; color: rgba(243,243,243,1); text-align: left; white-space: nowrap; padding: 0px 10px 0px 10px; overflow: hidden; text-overflow: ellipsis;' + '; color: ' + me._node_title.userData.textColor + ' !important;', true, false, false);
			me._node_title.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			params.push(player._(String(me.ggUserdata.title)));
			var hs = player._("%1", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._node_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._node_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._node_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._node_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="node_title";
		me._node_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._node_title.logicBlock_backgroundcolor = function() {
			var newLogicStateBackgroundColor;
			if (
				((me.elementMouseOver['node_title'] == true))
			)
			{
				newLogicStateBackgroundColor = 0;
			}
			else {
				newLogicStateBackgroundColor = -1;
			}
			if (me._node_title.ggCurrentLogicStateBackgroundColor != newLogicStateBackgroundColor) {
				me._node_title.ggCurrentLogicStateBackgroundColor = newLogicStateBackgroundColor;
				if (me._node_title.ggCurrentLogicStateBackgroundColor == 0) {
					me._node_title.userData.setBackgroundColor(player.getTHREESkinColor('#00aaff'));
					me._node_title.userData.setBackgroundColorAlpha(1);
					me._node_title.userData.ggUpdateText(true);
					player.repaint();
				}
				else {
					me._node_title.userData.setBackgroundColor(player.getTHREESkinColor('#00aaff'));
					me._node_title.userData.setBackgroundColorAlpha(0.666667);
					me._node_title.userData.ggUpdateText(true);
					player.repaint();
				}
			}
		}
		me._node_title.userData.onclick=function (e) {
			player.openNext("{"+me.ggNodeId+"}","");
		}
		me._node_title.userData.hasOwnClickAction = true;
		me._node_title.userData.onmouseenter=function (e) {
			me.elementMouseOver['node_title']=true;
			me._node_title.logicBlock_backgroundcolor();
		}
		me._node_title.userData.ontouchend=function (e) {
			me._node_title.logicBlock_backgroundcolor();
		}
		me._node_title.userData.onmouseleave=function (e) {
			me.elementMouseOver['node_title']=false;
			me._node_title.logicBlock_backgroundcolor();
		}
		me._node_title.userData.ggUpdatePosition=function (useTransition) {
				me._node_title.userData.ggUpdateText(true);
		}
		me.__obj.add(me._node_title);
		me._node_title.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._node_title.traverse((obj)=>{
				if (me._node_title.material) {
					me._node_title.material.transparent = (me._node_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._node_title.userData.ggUpdateText(true);
		me.elementMouseOver['node_title']=false;
		me._node_title.logicBlock_backgroundcolor();
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._node_title.traverse((obj)=>{
						if (me._node_title.material) {
							me._node_title.material.transparent = (me._node_title.userData.zIndexCurrent > 0);
							}
					});
				}
			};
	};
	me.addSkinHotspot3d=function(hotspot) {
		var hsinst = null;
			if (hotspot.skinid=='ht_video_vimeo') {
			hotspot.skinid = 'ht_video_vimeo';
			hsinst = new SkinHotspotClass_ht_video_vimeo__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_vimeo__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_video_vimeo__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_video_vimeo__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_video_youtube') {
			hotspot.skinid = 'ht_video_youtube';
			hsinst = new SkinHotspotClass_ht_video_youtube__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_youtube__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_video_youtube__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_video_youtube__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_pdf') {
			hotspot.skinid = 'ht_pdf';
			hsinst = new SkinHotspotClass_ht_pdf__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_pdf__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_pdf__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_pdf__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_info') {
			hotspot.skinid = 'ht_info';
			hsinst = new SkinHotspotClass_ht_info__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_info__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_info__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_image') {
			hotspot.skinid = 'ht_image';
			hsinst = new SkinHotspotClass_ht_image__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_image__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_image__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_node') {
			hotspot.skinid = 'ht_node';
			hsinst = new SkinHotspotClass_ht_node__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_node__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_node__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_video_file') {
			hotspot.skinid = 'ht_video_file';
			hsinst = new SkinHotspotClass_ht_video_file__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_video_file__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].push(hsinst);
		} else
		{
			hotspot.skinid = 'ht_video_url';
			hsinst = new SkinHotspotClass_ht_video_url__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_video_url__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].push(hsinst);
		}
		return (hsinst ? hsinst.__obj : null);
	}
	me.removeSkinHotspots=function() {
		hotspotTemplates = {};
	}
	player.addListener('hotspotsremoved',function() {
			me.removeSkinHotspots();
	});
	me.skinTimerEvent=function() {
		if (!player.isInVR()) return;
		me.ggCurrentTime=new Date().getTime();
	};
	player.addListener('timer', me.skinTimerEvent);
	player.addListener('vrconfigloaded', function() { me.addSkin();if (me.eventconfigloadedCallback) me.eventconfigloadedCallback();if (me.eventchangenodeCallback) me.eventchangenodeCallback();});
	player.addListener('exitvr', function() { me.removeSkin(); });
	me.skinTimerEvent();
};