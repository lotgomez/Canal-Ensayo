// Garden Gnome Software - VR - Skin
// Pano2VR 8.0.5/22607
// Filename: canal vr.ggsk
// Generated 2026-09-17T04:56:24Z

function pano2vrVrSkin(player,base) {
	player.addVariable('node_cloner_vr_hasUp', 2, false, { ignoreInState: 0  });
	player.addVariable('node_cloner_vr_hasDown', 2, false, { ignoreInState: 0  });
	player.addVariable('open_image_hs', 0, "", { ignoreInState: 0  });
	player.addVariable('open_info_hs', 0, "", { ignoreInState: 0  });
	player.addVariable('open_video_hs', 0, "", { ignoreInState: 0  });
	player.addVariable('info_w_picture_1', 1, 0, { ignoreInState: 0  });
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
		el.userData.width = 640;
		el.userData.height = 115;
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
		el.translateX(-2.45);
		el.translateY(0.075);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 150;
		el.userData.height = 100;
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
		el.userData.x = -2.45;
		el.userData.y = 0.075;
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
			if (me._node_cloner_vr.userData.ggCloneOffset + me._node_cloner_vr.userData.ggNumCols <= me._node_cloner_vr.userData.ggNumFilterPassed) {
				me._node_cloner_vr.userData.ggCloneOffset += me._node_cloner_vr.userData.ggNumCols;
				me._node_cloner_vr.userData.ggCloneOffsetChanged = true;
				me._node_cloner_vr.userData.ggUpdate();
			}
		}
		el.userData.ggGoDown = function() {
			if (me._node_cloner_vr.userData.ggCloneOffset > 0) {
				me._node_cloner_vr.userData.ggCloneOffset -= me._node_cloner_vr.userData.ggNumCols;
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
			var curNumCols = 0;
			var parentWidth = me._node_cloner_vr.parent.userData.width;
			me._node_cloner_vr.userData.offsetLeft = (me._node_cloner_vr.parent.userData.width / 200.0) + me._node_cloner_vr.userData.x - (me._node_cloner_vr.userData.width / 200.0);
			curNumCols = Math.floor(((parentWidth - me._node_cloner_vr.userData.offsetLeft) * me._node_cloner_vr.userData.ggNumRepeat / 100.0) / me._node_cloner_vr.userData.width);
			if (curNumCols < 1) curNumCols = 1;
			if (typeof filter=='object') {
				el.userData.ggFilter = filter;
			} else {
				filter = el.userData.ggFilter;
			};
			if (me.ggTag) filter.push(me.ggTag);
			filter=filter.sort();
			if ((el.userData.ggNumCols == curNumCols) && (el.userData.ggInstances.length > 0) && (filter.length === el.userData.ggCurrentFilter.length) && (filter.every(function(value, index) { return value === el.userData.ggCurrentFilter[index] }) ) && false) {
				me._node_cloner_vr.userData.ggUpdating = false;
				return;
			} else {
				el.userData.ggNumRows = 1;
				el.userData.ggNumCols = curNumCols;
			var centerOffsetHor = 0;
			var centerOffsetVert = 0;
			centerOffsetHor = ((parentWidth - (me._node_cloner_vr.userData.offsetLeft * 100.0)) % me._node_cloner_vr.userData.width) / 2;
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
			numNodes = me._node_cloner_vr.getFilteredNodes(tourNodes, filter).length;
			if ((parentWidth - (me._node_cloner_vr.userData.offsetLeft * 100.0)) > (me._node_cloner_vr.userData.width * numNodes)) {
				centerOffsetHor = ((parentWidth - (me._node_cloner_vr.userData.offsetLeft * 100.0)) - (me._node_cloner_vr.userData.width * numNodes)) / 2;
			}
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
				column++;
				if (column >= el.userData.ggNumCols) {
					keepCloning = false;
				}
			}
			player.setVariableValue('node_cloner_vr_hasDown', me._node_cloner_vr.userData.ggCloneOffset > 0);
			player.setVariableValue('node_cloner_vr_hasUp', me._node_cloner_vr.userData.ggCloneOffset + me._node_cloner_vr.userData.ggNumCols < me._node_cloner_vr.userData.ggNumFilterPassed);
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'page_up_bg_material';
			el.material = material;
		el.translateX(3.34);
		el.translateY(0.065);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 42;
		el.userData.height = 42;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'page_up_bg';
		el.userData.x = 3.34;
		el.userData.y = 0.065;
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
			let vis = me._page_up_bg.visible
			let parentEl = me._page_up_bg.parent;
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
			me._page_up_bg.userData.opacity = v;
			v = v * me._page_up_bg.userData.parentOpacity;
			if (me._page_up_bg.userData.setOpacityInternal) me._page_up_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_up_bg.children.length; i++) {
				let child = me._page_up_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._page_up_bg.userData.parentOpacity = v;
			v = v * me._page_up_bg.userData.opacity
			if (me._page_up_bg.userData.setOpacityInternal) me._page_up_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_up_bg.children.length; i++) {
				let child = me._page_up_bg.children[i];
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
		me._page_up_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._page_up_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._page_up_bg);
			if (skin.rectHasRoundedCorners(me._page_up_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._page_up_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._page_up_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._page_up_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._page_up_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'page_up_bg_geometry';
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
				geometry.name = 'page_up_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._page_up_bg.userData.backgroundColorAlpha = 0.588235;
		me._page_up_bg.userData.borderColorAlpha = 1;
		me._page_up_bg.userData.setOpacityInternal = function(v) {
			me._page_up_bg.material.opacity = v * me._page_up_bg.userData.backgroundColorAlpha;
			if (me._page_up_bg.userData.ggSubElement) {
				me._page_up_bg.userData.ggSubElement.material.opacity = v
				me._page_up_bg.userData.ggSubElement.visible = (v>0 && me._page_up_bg.userData.visible);
			}
			me._page_up_bg.visible = (v>0 && me._page_up_bg.userData.visible);
		}
		me._page_up_bg.userData.setBackgroundColor = function(v) {
			me._page_up_bg.material.color = v;
		}
		me._page_up_bg.userData.setBackgroundColorAlpha = function(v) {
			me._page_up_bg.userData.backgroundColorAlpha = v;
			me._page_up_bg.userData.setOpacity(me._page_up_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
		el.userData.ggId="page_up_bg";
		me._page_up_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._page_up_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['page_up_bg'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._page_up_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._page_up_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._page_up_bg.ggCurrentLogicStateScaling == 0) {
					me._page_up_bg.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
					for (var i = 0; i < me._page_up_bg.userData.transitions.length; i++) {
						if (me._page_up_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_up_bg.userData.transitions[i].interval);
							me._page_up_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_up_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_up_bg.scale.set(transition_scale.startScale.x + (me._page_up_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_up_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_up_bg.position.x = (me._page_up_bg.position.x - me._page_up_bg.userData.curScaleOffX) + scaleOffX;
							me._page_up_bg.userData.curScaleOffX = scaleOffX;
							me._page_up_bg.position.y = (me._page_up_bg.position.y - me._page_up_bg.userData.curScaleOffY) + scaleOffY;
							me._page_up_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_up_bg.userData.transitions.splice(me._page_up_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_up_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._page_up_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._page_up_bg.userData.transitions.length; i++) {
						if (me._page_up_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_up_bg.userData.transitions[i].interval);
							me._page_up_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_up_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_up_bg.scale.set(transition_scale.startScale.x + (me._page_up_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_up_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_up_bg.position.x = (me._page_up_bg.position.x - me._page_up_bg.userData.curScaleOffX) + scaleOffX;
							me._page_up_bg.userData.curScaleOffX = scaleOffX;
							me._page_up_bg.position.y = (me._page_up_bg.position.y - me._page_up_bg.userData.curScaleOffY) + scaleOffY;
							me._page_up_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_up_bg.userData.transitions.splice(me._page_up_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_up_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._page_up_bg.logicBlock_visible = function() {
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
			if (me._page_up_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._page_up_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._page_up_bg.ggCurrentLogicStateVisible == 0) {
			me._page_up_bg.visible=((!me._page_up_bg.material && Number(me._page_up_bg.userData.opacity>0)) || (me._page_up_bg.material && Number(me._page_up_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._page_up_bg.userData.visible=true;
				}
				else {
			me._page_up_bg.visible=false;
			player.repaint();
			me._page_up_bg.userData.visible=false;
				}
			}
		}
		me._page_up_bg.userData.onclick=function (e) {
			skin.findElements('node_cloner_vr')[0].userData.ggGoUp();
		}
		me._page_up_bg.userData.hasOwnClickAction = true;
		me._page_up_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['page_up_bg']=true;
			me._page_up_bg.logicBlock_scaling();
		}
		me._page_up_bg.userData.ontouchend=function (e) {
			me._page_up_bg.logicBlock_scaling();
		}
		me._page_up_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['page_up_bg']=false;
			me._page_up_bg.logicBlock_scaling();
		}
		me._page_up_bg.userData.ggUpdatePosition=function (useTransition) {
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
			if (me._page_up.userData.svgGroupNormal) me._page_up.userData.setOpacityInState(me._page_up.userData.svgGroupNormal, v);
			if (me._page_up.userData.svgGroupOver) me._page_up.userData.setOpacityInState(me._page_up.userData.svgGroupOver, v);
			if (me._page_up.userData.svgGroupActive) me._page_up.userData.setOpacityInState(me._page_up.userData.svgGroupActive, v);
			me._page_up.visible = (v>0 && me._page_up.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 42;
		el.userData.height = 42;
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._page_up = el;
		clickTargetGeometry = new THREE.PlaneGeometry(42 / 100.0, 42 / 100.0, 5, 5 );
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
		me._page_up.userData.ggUpdatePosition=function (useTransition) {
		}
		me._page_up_bg.add(me._page_up);
		me._thumbnails.add(me._page_up_bg);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'page_down_bg_material';
			el.material = material;
		el.translateX(-3.34);
		el.translateY(0.065);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 42;
		el.userData.height = 42;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'page_down_bg';
		el.userData.x = -3.34;
		el.userData.y = 0.065;
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
			let vis = me._page_down_bg.visible
			let parentEl = me._page_down_bg.parent;
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
			me._page_down_bg.userData.opacity = v;
			v = v * me._page_down_bg.userData.parentOpacity;
			if (me._page_down_bg.userData.setOpacityInternal) me._page_down_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_down_bg.children.length; i++) {
				let child = me._page_down_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._page_down_bg.userData.parentOpacity = v;
			v = v * me._page_down_bg.userData.opacity
			if (me._page_down_bg.userData.setOpacityInternal) me._page_down_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._page_down_bg.children.length; i++) {
				let child = me._page_down_bg.children[i];
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
		me._page_down_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._page_down_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._page_down_bg);
			if (skin.rectHasRoundedCorners(me._page_down_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._page_down_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._page_down_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._page_down_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._page_down_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'page_down_bg_geometry';
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
				geometry.name = 'page_down_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._page_down_bg.userData.backgroundColorAlpha = 0.588235;
		me._page_down_bg.userData.borderColorAlpha = 1;
		me._page_down_bg.userData.setOpacityInternal = function(v) {
			me._page_down_bg.material.opacity = v * me._page_down_bg.userData.backgroundColorAlpha;
			if (me._page_down_bg.userData.ggSubElement) {
				me._page_down_bg.userData.ggSubElement.material.opacity = v
				me._page_down_bg.userData.ggSubElement.visible = (v>0 && me._page_down_bg.userData.visible);
			}
			me._page_down_bg.visible = (v>0 && me._page_down_bg.userData.visible);
		}
		me._page_down_bg.userData.setBackgroundColor = function(v) {
			me._page_down_bg.material.color = v;
		}
		me._page_down_bg.userData.setBackgroundColorAlpha = function(v) {
			me._page_down_bg.userData.backgroundColorAlpha = v;
			me._page_down_bg.userData.setOpacity(me._page_down_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
		el.userData.ggId="page_down_bg";
		me._page_down_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._page_down_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['page_down_bg'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._page_down_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._page_down_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._page_down_bg.ggCurrentLogicStateScaling == 0) {
					me._page_down_bg.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
					for (var i = 0; i < me._page_down_bg.userData.transitions.length; i++) {
						if (me._page_down_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_down_bg.userData.transitions[i].interval);
							me._page_down_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_down_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_down_bg.scale.set(transition_scale.startScale.x + (me._page_down_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_down_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_down_bg.position.x = (me._page_down_bg.position.x - me._page_down_bg.userData.curScaleOffX) + scaleOffX;
							me._page_down_bg.userData.curScaleOffX = scaleOffX;
							me._page_down_bg.position.y = (me._page_down_bg.position.y - me._page_down_bg.userData.curScaleOffY) + scaleOffY;
							me._page_down_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_down_bg.userData.transitions.splice(me._page_down_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_down_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._page_down_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._page_down_bg.userData.transitions.length; i++) {
						if (me._page_down_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._page_down_bg.userData.transitions[i].interval);
							me._page_down_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._page_down_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._page_down_bg.scale.set(transition_scale.startScale.x + (me._page_down_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._page_down_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._page_down_bg.position.x = (me._page_down_bg.position.x - me._page_down_bg.userData.curScaleOffX) + scaleOffX;
							me._page_down_bg.userData.curScaleOffX = scaleOffX;
							me._page_down_bg.position.y = (me._page_down_bg.position.y - me._page_down_bg.userData.curScaleOffY) + scaleOffY;
							me._page_down_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._page_down_bg.userData.transitions.splice(me._page_down_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._page_down_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._page_down_bg.logicBlock_visible = function() {
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
			if (me._page_down_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._page_down_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._page_down_bg.ggCurrentLogicStateVisible == 0) {
			me._page_down_bg.visible=((!me._page_down_bg.material && Number(me._page_down_bg.userData.opacity>0)) || (me._page_down_bg.material && Number(me._page_down_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._page_down_bg.userData.visible=true;
				}
				else {
			me._page_down_bg.visible=false;
			player.repaint();
			me._page_down_bg.userData.visible=false;
				}
			}
		}
		me._page_down_bg.userData.onclick=function (e) {
			skin.findElements('node_cloner_vr')[0].userData.ggGoDown();
		}
		me._page_down_bg.userData.hasOwnClickAction = true;
		me._page_down_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['page_down_bg']=true;
			me._page_down_bg.logicBlock_scaling();
		}
		me._page_down_bg.userData.ontouchend=function (e) {
			me._page_down_bg.logicBlock_scaling();
		}
		me._page_down_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['page_down_bg']=false;
			me._page_down_bg.logicBlock_scaling();
		}
		me._page_down_bg.userData.ggUpdatePosition=function (useTransition) {
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
			if (me._page_down.userData.svgGroupNormal) me._page_down.userData.setOpacityInState(me._page_down.userData.svgGroupNormal, v);
			if (me._page_down.userData.svgGroupOver) me._page_down.userData.setOpacityInState(me._page_down.userData.svgGroupOver, v);
			if (me._page_down.userData.svgGroupActive) me._page_down.userData.setOpacityInState(me._page_down.userData.svgGroupActive, v);
			me._page_down.visible = (v>0 && me._page_down.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 42;
		el.userData.height = 42;
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
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.050);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.050;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 5;
		el.userData.renderOrder = 5;
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
		el.userData.opacity = 1.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._page_down = el;
		clickTargetGeometry = new THREE.PlaneGeometry(42 / 100.0, 42 / 100.0, 5, 5 );
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
		me._page_down.userData.ggUpdatePosition=function (useTransition) {
		}
		me._page_down_bg.add(me._page_down);
		me._thumbnails.add(me._page_down_bg);
		me.skinGroup.add(me._thumbnails);
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me.__close_skin.visible = (v>0 && me.__close_skin.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(-3.27);
		el.translateY(2.27);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 46;
		el.userData.height = 46;
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
		el.userData.x = -3.27;
		el.userData.y = 2.27;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'exit_vr_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.55);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 46;
		el.userData.height = 46;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'exit_vr';
		el.userData.x = 0;
		el.userData.y = -0.55;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._exit_vr.visible
			let parentEl = me._exit_vr.parent;
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
			me._exit_vr.userData.opacity = v;
			v = v * me._exit_vr.userData.parentOpacity;
			if (me._exit_vr.userData.setOpacityInternal) me._exit_vr.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr.children.length; i++) {
				let child = me._exit_vr.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._exit_vr.userData.parentOpacity = v;
			v = v * me._exit_vr.userData.opacity
			if (me._exit_vr.userData.setOpacityInternal) me._exit_vr.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr.children.length; i++) {
				let child = me._exit_vr.children[i];
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
		me._exit_vr = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._exit_vr;
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
			skin.rectCalcBorderRadiiInnerShape(me._exit_vr);
			if (skin.rectHasRoundedCorners(me._exit_vr)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._exit_vr.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._exit_vr.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._exit_vr.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._exit_vr.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'exit_vr_geometry';
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
				geometry.name = 'exit_vr_geometry';
			}
			el.geometry = geometry;
		}
		me._exit_vr.userData.backgroundColorAlpha = 0.588235;
		me._exit_vr.userData.borderColorAlpha = 1;
		me._exit_vr.userData.setOpacityInternal = function(v) {
			me._exit_vr.material.opacity = v * me._exit_vr.userData.backgroundColorAlpha;
			if (me._exit_vr.userData.ggSubElement) {
				me._exit_vr.userData.ggSubElement.material.opacity = v
				me._exit_vr.userData.ggSubElement.visible = (v>0 && me._exit_vr.userData.visible);
			}
			me._exit_vr.visible = (v>0 && me._exit_vr.userData.visible);
		}
		me._exit_vr.userData.setBackgroundColor = function(v) {
			me._exit_vr.material.color = v;
		}
		me._exit_vr.userData.setBackgroundColorAlpha = function(v) {
			me._exit_vr.userData.backgroundColorAlpha = v;
			me._exit_vr.userData.setOpacity(me._exit_vr.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
		el.userData.ggId="exit_vr";
		me._exit_vr.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._exit_vr.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['exit_vr'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._exit_vr.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._exit_vr.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._exit_vr.ggCurrentLogicStateScaling == 0) {
					me._exit_vr.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
					for (var i = 0; i < me._exit_vr.userData.transitions.length; i++) {
						if (me._exit_vr.userData.transitions[i].property == 'scale') {
							clearInterval(me._exit_vr.userData.transitions[i].interval);
							me._exit_vr.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._exit_vr.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._exit_vr.scale.set(transition_scale.startScale.x + (me._exit_vr.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._exit_vr.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._exit_vr.position.x = (me._exit_vr.position.x - me._exit_vr.userData.curScaleOffX) + scaleOffX;
							me._exit_vr.userData.curScaleOffX = scaleOffX;
							me._exit_vr.position.y = (me._exit_vr.position.y - me._exit_vr.userData.curScaleOffY) + scaleOffY;
							me._exit_vr.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._exit_vr.userData.transitions.splice(me._exit_vr.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._exit_vr.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._exit_vr.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._exit_vr.userData.transitions.length; i++) {
						if (me._exit_vr.userData.transitions[i].property == 'scale') {
							clearInterval(me._exit_vr.userData.transitions[i].interval);
							me._exit_vr.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._exit_vr.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._exit_vr.scale.set(transition_scale.startScale.x + (me._exit_vr.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._exit_vr.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._exit_vr.position.x = (me._exit_vr.position.x - me._exit_vr.userData.curScaleOffX) + scaleOffX;
							me._exit_vr.userData.curScaleOffX = scaleOffX;
							me._exit_vr.position.y = (me._exit_vr.position.y - me._exit_vr.userData.curScaleOffY) + scaleOffY;
							me._exit_vr.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._exit_vr.userData.transitions.splice(me._exit_vr.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._exit_vr.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._exit_vr.userData.onclick=function (e) {
			player.exitVR();
			player.setVRSkinVisibility("0");
		}
		me._exit_vr.userData.hasOwnClickAction = true;
		me._exit_vr.userData.onmouseenter=function (e) {
			me.elementMouseOver['exit_vr']=true;
			me._exit_vr.logicBlock_scaling();
		}
		me._exit_vr.userData.ontouchend=function (e) {
			me._exit_vr.logicBlock_scaling();
		}
		me._exit_vr.userData.onmouseleave=function (e) {
			me.elementMouseOver['exit_vr']=false;
			me._exit_vr.logicBlock_scaling();
		}
		me._exit_vr.userData.ggUpdatePosition=function (useTransition) {
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
			if (me._exit_vr_icon.userData.svgGroupNormal) me._exit_vr_icon.userData.setOpacityInState(me._exit_vr_icon.userData.svgGroupNormal, v);
			if (me._exit_vr_icon.userData.svgGroupOver) me._exit_vr_icon.userData.setOpacityInState(me._exit_vr_icon.userData.svgGroupOver, v);
			if (me._exit_vr_icon.userData.svgGroupActive) me._exit_vr_icon.userData.setOpacityInState(me._exit_vr_icon.userData.svgGroupActive, v);
			me._exit_vr_icon.visible = (v>0 && me._exit_vr_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 37;
		el.userData.height = 37;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'exit_vr_icon';
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
			let vis = me._exit_vr_icon.visible
			let parentEl = me._exit_vr_icon.parent;
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
			me._exit_vr_icon.userData.opacity = v;
			v = v * me._exit_vr_icon.userData.parentOpacity;
			if (me._exit_vr_icon.userData.setOpacityInternal) me._exit_vr_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr_icon.children.length; i++) {
				let child = me._exit_vr_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._exit_vr_icon.userData.parentOpacity = v;
			v = v * me._exit_vr_icon.userData.opacity
			if (me._exit_vr_icon.userData.setOpacityInternal) me._exit_vr_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._exit_vr_icon.children.length; i++) {
				let child = me._exit_vr_icon.children[i];
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
		me._exit_vr_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(37 / 100.0, 37 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'exit_vr_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'exit_vr_icon_clickTargetMaterial';
		me._exit_vr_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._exit_vr_icon.userData.clickTarget.name = 'exit_vr_icon_clickTarget';
		me._exit_vr_icon.userData.clickTarget.userData.clickInvisible = true;
		me._exit_vr_icon.userData.clickTarget.visible = false;
		me._exit_vr_icon.add(me._exit_vr_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/exit_vr_icon.svg', me._exit_vr_icon.userData.width / 100.0, me._exit_vr_icon.userData.height / 100.0);
			me._exit_vr_icon.add(group);
			me._exit_vr_icon.userData.svgGroupNormal = group;
			me._exit_vr_icon.userData.setOpacityInState(group, me._exit_vr_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="exit_vr_icon";
		me._exit_vr_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._exit_vr_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._exit_vr.add(me._exit_vr_icon);
		me.__close_skin.add(me._exit_vr);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'close_skin_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 46;
		el.userData.height = 46;
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
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
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
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._close_skin;
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
			skin.rectCalcBorderRadiiInnerShape(me._close_skin);
			if (skin.rectHasRoundedCorners(me._close_skin)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._close_skin.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._close_skin.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._close_skin.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._close_skin.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'close_skin_geometry';
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
				geometry.name = 'close_skin_geometry';
			}
			el.geometry = geometry;
		}
		me._close_skin.userData.backgroundColorAlpha = 0.588235;
		me._close_skin.userData.borderColorAlpha = 1;
		me._close_skin.userData.setOpacityInternal = function(v) {
			me._close_skin.material.opacity = v * me._close_skin.userData.backgroundColorAlpha;
			if (me._close_skin.userData.ggSubElement) {
				me._close_skin.userData.ggSubElement.material.opacity = v
				me._close_skin.userData.ggSubElement.visible = (v>0 && me._close_skin.userData.visible);
			}
			me._close_skin.visible = (v>0 && me._close_skin.userData.visible);
		}
		me._close_skin.userData.setBackgroundColor = function(v) {
			me._close_skin.material.color = v;
		}
		me._close_skin.userData.setBackgroundColorAlpha = function(v) {
			me._close_skin.userData.backgroundColorAlpha = v;
			me._close_skin.userData.setOpacity(me._close_skin.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
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
					me._close_skin.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
			if (me._close_skin_icon.userData.svgGroupNormal) me._close_skin_icon.userData.setOpacityInState(me._close_skin_icon.userData.svgGroupNormal, v);
			if (me._close_skin_icon.userData.svgGroupOver) me._close_skin_icon.userData.setOpacityInState(me._close_skin_icon.userData.svgGroupOver, v);
			if (me._close_skin_icon.userData.svgGroupActive) me._close_skin_icon.userData.setOpacityInState(me._close_skin_icon.userData.svgGroupActive, v);
			me._close_skin_icon.visible = (v>0 && me._close_skin_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 44;
		el.userData.height = 44;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'close_skin_icon';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.050);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.050;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 5;
		el.userData.renderOrder = 5;
		el.userData.isVisible = function() {
			let vis = me._close_skin_icon.visible
			let parentEl = me._close_skin_icon.parent;
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
			me._close_skin_icon.userData.opacity = v;
			v = v * me._close_skin_icon.userData.parentOpacity;
			if (me._close_skin_icon.userData.setOpacityInternal) me._close_skin_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._close_skin_icon.children.length; i++) {
				let child = me._close_skin_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._close_skin_icon.userData.parentOpacity = v;
			v = v * me._close_skin_icon.userData.opacity
			if (me._close_skin_icon.userData.setOpacityInternal) me._close_skin_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._close_skin_icon.children.length; i++) {
				let child = me._close_skin_icon.children[i];
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
		me._close_skin_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(44 / 100.0, 44 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'close_skin_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'close_skin_icon_clickTargetMaterial';
		me._close_skin_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._close_skin_icon.userData.clickTarget.name = 'close_skin_icon_clickTarget';
		me._close_skin_icon.userData.clickTarget.userData.clickInvisible = true;
		me._close_skin_icon.userData.clickTarget.visible = false;
		me._close_skin_icon.add(me._close_skin_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/close_skin_icon.svg', me._close_skin_icon.userData.width / 100.0, me._close_skin_icon.userData.height / 100.0);
			me._close_skin_icon.add(group);
			me._close_skin_icon.userData.svgGroupNormal = group;
			me._close_skin_icon.userData.setOpacityInState(group, me._close_skin_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="close_skin_icon";
		me._close_skin_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._close_skin_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._close_skin.add(me._close_skin_icon);
		me.__close_skin.add(me._close_skin);
		me.player.setVRHideSkinButton(me.__close_skin);
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me.__open_skin.visible = (v>0 && me.__open_skin.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(-3.27);
		el.translateY(2.27);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 46;
		el.userData.height = 46;
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
		el.userData.x = -3.27;
		el.userData.y = 2.27;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'open_skin_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 46;
		el.userData.height = 46;
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
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._open_skin;
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
			skin.rectCalcBorderRadiiInnerShape(me._open_skin);
			if (skin.rectHasRoundedCorners(me._open_skin)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._open_skin.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._open_skin.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._open_skin.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._open_skin.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'open_skin_geometry';
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
				geometry.name = 'open_skin_geometry';
			}
			el.geometry = geometry;
		}
		me._open_skin.userData.backgroundColorAlpha = 0.588235;
		me._open_skin.userData.borderColorAlpha = 1;
		me._open_skin.userData.setOpacityInternal = function(v) {
			me._open_skin.material.opacity = v * me._open_skin.userData.backgroundColorAlpha;
			if (me._open_skin.userData.ggSubElement) {
				me._open_skin.userData.ggSubElement.material.opacity = v
				me._open_skin.userData.ggSubElement.visible = (v>0 && me._open_skin.userData.visible);
			}
			me._open_skin.visible = (v>0 && me._open_skin.userData.visible);
		}
		me._open_skin.userData.setBackgroundColor = function(v) {
			me._open_skin.material.color = v;
		}
		me._open_skin.userData.setBackgroundColorAlpha = function(v) {
			me._open_skin.userData.backgroundColorAlpha = v;
			me._open_skin.userData.setOpacity(me._open_skin.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
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
					me._open_skin.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
			if (me._open_skin_icon.userData.svgGroupNormal) me._open_skin_icon.userData.setOpacityInState(me._open_skin_icon.userData.svgGroupNormal, v);
			if (me._open_skin_icon.userData.svgGroupOver) me._open_skin_icon.userData.setOpacityInState(me._open_skin_icon.userData.svgGroupOver, v);
			if (me._open_skin_icon.userData.svgGroupActive) me._open_skin_icon.userData.setOpacityInState(me._open_skin_icon.userData.svgGroupActive, v);
			me._open_skin_icon.visible = (v>0 && me._open_skin_icon.userData.visible);
		}
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 44;
		el.userData.height = 44;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'open_skin_icon';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.050);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.050;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 5;
		el.userData.renderOrder = 5;
		el.userData.isVisible = function() {
			let vis = me._open_skin_icon.visible
			let parentEl = me._open_skin_icon.parent;
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
			me._open_skin_icon.userData.opacity = v;
			v = v * me._open_skin_icon.userData.parentOpacity;
			if (me._open_skin_icon.userData.setOpacityInternal) me._open_skin_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._open_skin_icon.children.length; i++) {
				let child = me._open_skin_icon.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._open_skin_icon.userData.parentOpacity = v;
			v = v * me._open_skin_icon.userData.opacity
			if (me._open_skin_icon.userData.setOpacityInternal) me._open_skin_icon.userData.setOpacityInternal(v);
			for (let i = 0; i < me._open_skin_icon.children.length; i++) {
				let child = me._open_skin_icon.children[i];
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
		me._open_skin_icon = el;
		clickTargetGeometry = new THREE.PlaneGeometry(44 / 100.0, 44 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'open_skin_icon_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'open_skin_icon_clickTargetMaterial';
		me._open_skin_icon.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._open_skin_icon.userData.clickTarget.name = 'open_skin_icon_clickTarget';
		me._open_skin_icon.userData.clickTarget.userData.clickInvisible = true;
		me._open_skin_icon.userData.clickTarget.visible = false;
		me._open_skin_icon.add(me._open_skin_icon.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/open_skin_icon.svg', me._open_skin_icon.userData.width / 100.0, me._open_skin_icon.userData.height / 100.0);
			me._open_skin_icon.add(group);
			me._open_skin_icon.userData.svgGroupNormal = group;
			me._open_skin_icon.userData.setOpacityInState(group, me._open_skin_icon.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="open_skin_icon";
		me._open_skin_icon.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._open_skin_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._open_skin.add(me._open_skin_icon);
		me.__open_skin.add(me._open_skin);
		me.player.setVRShowSkinButton(me.__open_skin);
		el = new THREE.Group();
		el.userData.setOpacityInternal = function(v) {
			me._information.visible = (v>0 && me._information.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.translateX(-1.14);
		el.translateY(-0.89);
		el.scale.set(1.20, 1.20, 1.0);
		el.userData.width = 350;
		el.userData.height = 400;
		el.userData.scale = {x: 1.20, y: 1.20, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'information';
		el.userData.x = -1.14;
		el.userData.y = -0.89;
		el.translateZ(0.240);
		el.userData.zIndex = 10;
		el.userData.zIndexCurrent = 10;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 1;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.setOpacityInternal = function(v) {
			if (me._information.material) me._information.material.opacity = v;
			me._information.visible = (v>0 && me._information.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._information.visible
			let parentEl = me._information.parent;
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
			me._information.userData.opacity = v;
			v = v * me._information.userData.parentOpacity;
			if (me._information.userData.setOpacityInternal) me._information.userData.setOpacityInternal(v);
			for (let i = 0; i < me._information.children.length; i++) {
				let child = me._information.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._information.userData.parentOpacity = v;
			v = v * me._information.userData.opacity
			if (me._information.userData.setOpacityInternal) me._information.userData.setOpacityInternal(v);
			for (let i = 0; i < me._information.children.length; i++) {
				let child = me._information.children[i];
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
		me._information = el;
		el.userData.ggId="information";
		me._information.userData.ggIsActive=function() {
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._information.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((player.getViewerSize(true).width <= 1024)) && 
				((player.getViewerSize(true).width > 480))
			)
			{
				newLogicStateScaling = 0;
			}
			else if (
				((player.getViewerSize(true).width <= 480))
			)
			{
				newLogicStateScaling = 1;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._information.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._information.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._information.ggCurrentLogicStateScaling == 0) {
					me._information.scale.set(1, 1, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
					me._information.position.x = (me._information.position.x - me._information.userData.curScaleOffX) + scaleOffX;
					me._information.userData.curScaleOffX = scaleOffX;
					me._information.position.y = (me._information.position.y - me._information.userData.curScaleOffY) + scaleOffY;
					me._information.userData.curScaleOffY = scaleOffY;
				}
				else if (me._information.ggCurrentLogicStateScaling == 1) {
					me._information.scale.set(0.6, 0.6, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
					me._information.position.x = (me._information.position.x - me._information.userData.curScaleOffX) + scaleOffX;
					me._information.userData.curScaleOffX = scaleOffX;
					me._information.position.y = (me._information.position.y - me._information.userData.curScaleOffY) + scaleOffY;
					me._information.userData.curScaleOffY = scaleOffY;
				}
				else {
					me._information.scale.set(1.2, 1.2, 1.0);
					var scaleOffX = 0;
					var scaleOffY = 0;
					me._information.position.x = (me._information.position.x - me._information.userData.curScaleOffX) + scaleOffX;
					me._information.userData.curScaleOffX = scaleOffX;
					me._information.position.y = (me._information.position.y - me._information.userData.curScaleOffY) + scaleOffY;
					me._information.userData.curScaleOffY = scaleOffY;
				}
			}
		}
		me._information.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('info_w_picture_1') > Number("0")))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._information.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._information.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._information.ggCurrentLogicStateVisible == 0) {
			me._information.visible=((!me._information.material && Number(me._information.userData.opacity>0)) || (me._information.material && Number(me._information.material.opacity)>0))?true:false;
			player.repaint();
			me._information.userData.visible=true;
				}
				else {
			me._information.visible=false;
			player.repaint();
			me._information.userData.visible=false;
				}
			}
		}
		me._information.userData.ggUpdatePosition=function (useTransition) {
			me._information.logicBlock_scaling();
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#ffffff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'information_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 350;
		el.userData.height = 400;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'information_bg';
		el.userData.x = 0;
		el.userData.y = 0;
		el.translateZ(0.050);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.050;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 5;
		el.userData.renderOrder = 5;
		el.userData.isVisible = function() {
			let vis = me._information_bg.visible
			let parentEl = me._information_bg.parent;
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
			me._information_bg.userData.opacity = v;
			v = v * me._information_bg.userData.parentOpacity;
			if (me._information_bg.userData.setOpacityInternal) me._information_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._information_bg.children.length; i++) {
				let child = me._information_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._information_bg.userData.parentOpacity = v;
			v = v * me._information_bg.userData.opacity
			if (me._information_bg.userData.setOpacityInternal) me._information_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._information_bg.children.length; i++) {
				let child = me._information_bg.children[i];
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
		me._information_bg = el;
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
			let el = me._information_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._information_bg);
			if (skin.rectHasRoundedCorners(me._information_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._information_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._information_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._information_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._information_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'information_bg_geometry';
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
				geometry.name = 'information_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._information_bg.userData.backgroundColorAlpha = 1;
		me._information_bg.userData.borderColorAlpha = 1;
		me._information_bg.userData.setOpacityInternal = function(v) {
			me._information_bg.material.opacity = v * me._information_bg.userData.backgroundColorAlpha;
			if (me._information_bg.userData.ggSubElement) {
				me._information_bg.userData.ggSubElement.material.opacity = v
				me._information_bg.userData.ggSubElement.visible = (v>0 && me._information_bg.userData.visible);
			}
			me._information_bg.visible = (v>0 && me._information_bg.userData.visible);
		}
		me._information_bg.userData.setBackgroundColor = function(v) {
			me._information_bg.material.color = v;
		}
		me._information_bg.userData.setBackgroundColorAlpha = function(v) {
			me._information_bg.userData.backgroundColorAlpha = v;
			me._information_bg.userData.setOpacity(me._information_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.ggId="information_bg";
		me._information_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._information_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		me._information.add(me._information_bg);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'info_text_body_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-1.365);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 340;
		el.userData.height = 111;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'info_text_body';
		el.userData.x = 0;
		el.userData.y = -1.365;
		el.translateZ(0.060);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.060;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 6;
		el.userData.renderOrder = 6;
		el.userData.isVisible = function() {
			let vis = me._info_text_body.visible
			let parentEl = me._info_text_body.parent;
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
			me._info_text_body.userData.opacity = v;
			v = v * me._info_text_body.userData.parentOpacity;
			if (me._info_text_body.userData.setOpacityInternal) me._info_text_body.userData.setOpacityInternal(v);
			for (let i = 0; i < me._info_text_body.children.length; i++) {
				let child = me._info_text_body.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._info_text_body.userData.parentOpacity = v;
			v = v * me._info_text_body.userData.opacity
			if (me._info_text_body.userData.setOpacityInternal) me._info_text_body.userData.setOpacityInternal(v);
			for (let i = 0; i < me._info_text_body.children.length; i++) {
				let child = me._info_text_body.children[i];
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
		me._info_text_body = el;
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
			let el = me._info_text_body;
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
			skin.rectCalcBorderRadiiInnerShape(me._info_text_body);
			if (skin.rectHasRoundedCorners(me._info_text_body)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._info_text_body.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._info_text_body.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._info_text_body.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._info_text_body.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'info_text_body_geometry';
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
				geometry.name = 'info_text_body_geometry';
			}
			el.geometry = geometry;
		}
		me._info_text_body.userData.backgroundColorAlpha = 1;
		me._info_text_body.userData.borderColorAlpha = 1;
		me._info_text_body.userData.setOpacityInternal = function(v) {
			me._info_text_body.material.opacity = v;
			if (me._info_text_body.userData.hasScrollbar) {
				me._info_text_body.userData.scrollbar.material.opacity = v;
				me._info_text_body.userData.scrollbarBg.material.opacity = v;
			}
			if (me._info_text_body.userData.ggSubElement) {
				me._info_text_body.userData.ggSubElement.material.opacity = v
				me._info_text_body.userData.ggSubElement.visible = (v>0 && me._info_text_body.userData.visible);
			}
			me._info_text_body.visible = (v>0 && me._info_text_body.userData.visible);
		}
		me._info_text_body.userData.setBackgroundColor = function(v) {
			me._info_text_body.material.color = v;
		}
		me._info_text_body.userData.setBackgroundColorAlpha = function(v) {
			me._info_text_body.userData.backgroundColorAlpha = v;
			me._info_text_body.userData.setOpacity(me._info_text_body.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#000000';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 680;
		canvas.height = 222;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._info_text_body;
			var canv = me._info_text_body.userData.textCanvas;
			var ctx = me._info_text_body.userData.textCanvasContext;
			var tmpCanv = me._info_text_body.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._info_text_body.userData.backgroundColor.r * 255 + ', ' + me._info_text_body.userData.backgroundColor.g * 255 + ', ' + me._info_text_body.userData.backgroundColor.b * 255 + ', ' + me._info_text_body.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._info_text_body.userData.scrollPosPercent ? tmpCanv.height * me._info_text_body.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'info_text_body_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._info_text_body.material.map) {
				me._info_text_body.material.map.dispose();
			}
			me._info_text_body.material.map = textTexture;
			me._info_text_body.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._info_text_body, 'scrollbar');
			skin.paintTextDivToCanvas(me._info_text_body, 'box-sizing: border-box; width: 340px; height: auto; color: rgba(0,0,0,1); text-align: left; white-space: pre-line; padding: 0px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._info_text_body.userData.textColor + ' !important;', false, false, true, true);
			if (me._info_text_body.userData.totalHeightCanv > (me._info_text_body.userData.height)) {
				skin.paintTextDivToCanvas(me._info_text_body, 'box-sizing: border-box; width: 320px; height: auto; color: rgba(0,0,0,1); text-align: left; white-space: pre-line; padding: 0px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._info_text_body.userData.textColor + ' !important;', false, false, true);
			} else {
			skin.paintTextDivToCanvas(me._info_text_body, 'box-sizing: border-box; width: 340px; height: auto; color: rgba(0,0,0,1); text-align: left; white-space: pre-line; padding: 0px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._info_text_body.userData.textColor + ' !important;', false, false, true);
			}
			me._info_text_body.userData.scrollPosPercent = 0.0
			if (me._info_text_body.userData.totalHeightCanv > ((me._info_text_body.userData.height))) {
				me._info_text_body.userData.pagePercent = ((me._info_text_body.userData.height) - me._info_text_body.userData.lineHeight) / me._info_text_body.userData.totalHeightCanv;
				me._info_text_body.userData.maxScrollPercent = (me._info_text_body.userData.totalHeightCanv - (1 * (me._info_text_body.userData.height))) / me._info_text_body.userData.totalHeightCanv;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._info_text_body.userData.height / 100.0, 5, 5 );
				geometry.name = 'info_text_body_scrollbarBgGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x7f7f7f, side: THREE.DoubleSide, transparent: true } );
				material.name = 'info_text_body_scrollbarBgMaterial';
				me._info_text_body.userData.scrollbarBg = new THREE.Mesh( geometry, material );
				me._info_text_body.userData.scrollbarBg.name = 'info_text_body_scrollbarBg';
				me._info_text_body.add(me._info_text_body.userData.scrollbarBg);
				me._info_text_body.userData.scrollbarXPos = (me._info_text_body.userData.width - 20) / 200.0;
				me._info_text_body.userData.scrollbarBg.position.x = me._info_text_body.userData.scrollbarXPos;
				me._info_text_body.userData.scrollbarBg.position.z = me._info_text_body.position.z + 0.01;
				me._info_text_body.userData.scrollbarBg.userData.stopPropagation = true;
				me._info_text_body.userData.scrollbarHeight = ((1 * me._info_text_body.userData.height) / me._info_text_body.userData.totalHeightCanv) * me._info_text_body.userData.height;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._info_text_body.userData.scrollbarHeight / 100.0, 5, 5 );
				geometry.name = 'info_text_body_scrollbarGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0xbfbfbf, side: THREE.DoubleSide, transparent: true } );
				material.name = 'info_text_body_scrollbarMaterial';
				me._info_text_body.userData.scrollbar = new THREE.Mesh( geometry, material );
				me._info_text_body.userData.scrollbar.name = 'info_text_body_scrollbar';
				me._info_text_body.add(me._info_text_body.userData.scrollbar);
				me._info_text_body.userData.scrollbar.position.x = me._info_text_body.userData.scrollbarXPos;
				me._info_text_body.userData.scrollbar.position.z = me._info_text_body.position.z + 0.02;
				me._info_text_body.userData.scrollbarYPosMin = (me._info_text_body.userData.height - me._info_text_body.userData.scrollbarHeight) / 200.0;
				me._info_text_body.userData.scrollbarYPosMax = me._info_text_body.userData.scrollbarYPosMin - (me._info_text_body.userData.height - me._info_text_body.userData.scrollbarHeight) / 100.0;
				me._info_text_body.userData.scrollbar.position.y = me._info_text_body.userData.scrollbarYPosMin;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._info_text_body.userData.height / 200.0, 5, 5 );
				geometry.name = 'info_text_body_scrollbarPageDownGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'info_text_body_scrollbarPageDownMaterial';
				me._info_text_body.userData.scrollbarPageDown = new THREE.Mesh( geometry, material );
				me._info_text_body.userData.scrollbarPageDown.name = 'info_text_body_scrollbarPageDown';
				me._info_text_body.userData.scrollbarPageDown.userData.onclick = function() {
					me._info_text_body.userData.scrollPosPercent -= me._info_text_body.userData.pagePercent;
					me._info_text_body.userData.scrollPosPercent = Math.max(me._info_text_body.userData.scrollPosPercent, 0);
					me._info_text_body.userData.ggTextureFromCanvas();
					me._info_text_body.userData.scrollbar.position.y += (me._info_text_body.userData.height * me._info_text_body.userData.pagePercent) / 100.0;
					me._info_text_body.userData.scrollbar.position.y = Math.min(me._info_text_body.userData.scrollbar.position.y, me._info_text_body.userData.scrollbarYPosMin);
				}
				me._info_text_body.userData.scrollbarPageDown.position.x = me._info_text_body.userData.scrollbarXPos;
				me._info_text_body.userData.scrollbarPageDown.position.y = me._info_text_body.userData.height / 400.0;
				me._info_text_body.userData.scrollbarPageDown.position.z = me._info_text_body.position.z + 0.05;
				me._info_text_body.userData.scrollbarPageDown.userData.stopPropagation = true;
				me._info_text_body.userData.scrollbarPageDown.userData.clickInvisible = true;
				me._info_text_body.userData.scrollbarPageDown.visible = false;
				me._info_text_body.add(me._info_text_body.userData.scrollbarPageDown);
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._info_text_body.userData.height / 200.0, 5, 5 );
				geometry.name = 'info_text_body_scrollbarPageUpGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'info_text_body_scrollbarPageUpMaterial';
				me._info_text_body.userData.scrollbarPageUp = new THREE.Mesh( geometry, material );
				me._info_text_body.userData.scrollbarPageUp.name = 'info_text_body_scrollbarPageUp';
				me._info_text_body.userData.scrollbarPageUp.userData.onclick = function() {
					me._info_text_body.userData.scrollPosPercent += me._info_text_body.userData.pagePercent;
					me._info_text_body.userData.scrollPosPercent = Math.min(me._info_text_body.userData.scrollPosPercent, me._info_text_body.userData.maxScrollPercent);
					me._info_text_body.userData.ggTextureFromCanvas();
					me._info_text_body.userData.scrollbar.position.y -= (me._info_text_body.userData.height * me._info_text_body.userData.pagePercent) / 100.0;
					me._info_text_body.userData.scrollbar.position.y = Math.max(me._info_text_body.userData.scrollbar.position.y, me._info_text_body.userData.scrollbarYPosMax);
				}
				me._info_text_body.userData.scrollbarPageUp.position.x = me._info_text_body.userData.scrollbarXPos;
				me._info_text_body.userData.scrollbarPageUp.position.y = -me._info_text_body.userData.height / 400.0;
				me._info_text_body.userData.scrollbarPageUp.position.z = me._info_text_body.position.z + 0.05;
				me._info_text_body.userData.scrollbarPageUp.userData.stopPropagation = true;
				me._info_text_body.userData.scrollbarPageUp.userData.clickInvisible = true;
				me._info_text_body.userData.scrollbarPageUp.visible = false;
				me._info_text_body.add(me._info_text_body.userData.scrollbarPageUp);
				me._info_text_body.userData.hasScrollbar = true;
			} else {
				me._info_text_body.userData.hasScrollbar = false;
			}
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			var hs = player._("", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._info_text_body.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._info_text_body.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._info_text_body.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._info_text_body.userData.textColorAlpha = v;
		}
		el.userData.ggId="info_text_body";
		me._info_text_body.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._info_text_body.userData.ggUpdatePosition=function (useTransition) {
				me._info_text_body.userData.ggUpdateText(true);
		}
		me._information.add(me._info_text_body);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#ffffff'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'popup_imagen_material';
			el.material = material;
		el.translateX(-0.005);
		el.translateY(0.445);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 333;
		el.userData.height = 223;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'popup_imagen';
		el.userData.x = -0.005;
		el.userData.y = 0.445;
		el.translateZ(0.070);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.070;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 7;
		el.userData.renderOrder = 7;
		el.userData.isVisible = function() {
			let vis = me._popup_imagen.visible
			let parentEl = me._popup_imagen.parent;
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
			me._popup_imagen.userData.opacity = v;
			v = v * me._popup_imagen.userData.parentOpacity;
			if (me._popup_imagen.userData.setOpacityInternal) me._popup_imagen.userData.setOpacityInternal(v);
			for (let i = 0; i < me._popup_imagen.children.length; i++) {
				let child = me._popup_imagen.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._popup_imagen.userData.parentOpacity = v;
			v = v * me._popup_imagen.userData.opacity
			if (me._popup_imagen.userData.setOpacityInternal) me._popup_imagen.userData.setOpacityInternal(v);
			for (let i = 0; i < me._popup_imagen.children.length; i++) {
				let child = me._popup_imagen.children[i];
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
		me._popup_imagen = el;
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
			let el = me._popup_imagen;
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
			skin.rectCalcBorderRadiiInnerShape(me._popup_imagen);
			if (skin.rectHasRoundedCorners(me._popup_imagen)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._popup_imagen.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._popup_imagen.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._popup_imagen.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._popup_imagen.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'popup_imagen_geometry';
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
				geometry.name = 'popup_imagen_geometry';
			}
			el.geometry = geometry;
		}
		me._popup_imagen.userData.backgroundColorAlpha = 1;
		me._popup_imagen.userData.borderColorAlpha = 1;
		me._popup_imagen.userData.setOpacityInternal = function(v) {
			me._popup_imagen.material.opacity = v * me._popup_imagen.userData.backgroundColorAlpha;
			if (me._popup_imagen.userData.ggSubElement) {
				me._popup_imagen.userData.ggSubElement.material.opacity = v
				me._popup_imagen.userData.ggSubElement.visible = (v>0 && me._popup_imagen.userData.visible);
			}
			me._popup_imagen.visible = (v>0 && me._popup_imagen.userData.visible);
		}
		me._popup_imagen.userData.setBackgroundColor = function(v) {
			me._popup_imagen.material.color = v;
		}
		me._popup_imagen.userData.setBackgroundColorAlpha = function(v) {
			me._popup_imagen.userData.backgroundColorAlpha = v;
			me._popup_imagen.userData.setOpacity(me._popup_imagen.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 333;
		currentHeight = 223;
		var img = {};
		img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
		img.geometry.name = 'popup_imagen_imgGeometry';
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._popup_imagen.userData.ggSubElement.material) {
					tmpDepthTest = me._popup_imagen.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'popup_imagen_subElementMaterial';
				me._popup_imagen.userData.ggSubElement.material = loadedMaterial;
				me._popup_imagen.userData.ggUpdatePosition();
				me._popup_imagen.userData.ggText = extUrl;
				me._popup_imagen.userData.setOpacity(me._popup_imagen.userData.opacity);
			});
		};
		var extUrl=basePath + "";
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'popup_imagen_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'popup_imagen_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 333;
		el.userData.clientHeight = 223;
		el.userData.ggId="popup_imagen";
		me._popup_imagen.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._popup_imagen.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.getVariableValue('info_w_picture_1') > Number("0")))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._popup_imagen.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._popup_imagen.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._popup_imagen.ggCurrentLogicStateVisible == 0) {
			me._popup_imagen.visible=((!me._popup_imagen.material && Number(me._popup_imagen.userData.opacity>0)) || (me._popup_imagen.material && Number(me._popup_imagen.material.opacity)>0))?true:false;
			player.repaint();
			me._popup_imagen.userData.visible=true;
				}
				else {
			me._popup_imagen.visible=false;
			player.repaint();
			me._popup_imagen.userData.visible=false;
				}
			}
		}
		me._popup_imagen.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._popup_imagen.userData.clientWidth;
			var parentHeight = me._popup_imagen.userData.clientHeight;
			var img = me._popup_imagen.userData.ggSubElement;
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
			img.geometry.name = 'popup_imagen_imgGeometry';
			} else {
				currentWidth = parentWidth;
				currentHeight = parentWidth / aspectRatioImg;
			img.geometry = new THREE.PlaneGeometry(currentWidth / 100.0, currentHeight / 100.0, 5, 5);
			img.geometry.name = 'popup_imagen_imgGeometry';
			};
		}
		me._information.add(me._popup_imagen);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'info_title_material';
			el.material = material;
		el.translateX(-0.405);
		el.translateY(1.76);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 245;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'info_title';
		el.userData.x = -0.405;
		el.userData.y = 1.76;
		el.translateZ(0.080);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.080;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'sticky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 8;
		el.userData.renderOrder = 8;
		el.userData.isVisible = function() {
			let vis = me._info_title.visible
			let parentEl = me._info_title.parent;
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
			me._info_title.userData.opacity = v;
			v = v * me._info_title.userData.parentOpacity;
			if (me._info_title.userData.setOpacityInternal) me._info_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._info_title.children.length; i++) {
				let child = me._info_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._info_title.userData.parentOpacity = v;
			v = v * me._info_title.userData.opacity
			if (me._info_title.userData.setOpacityInternal) me._info_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._info_title.children.length; i++) {
				let child = me._info_title.children[i];
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
		me._info_title = el;
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
			let el = me._info_title;
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
			skin.rectCalcBorderRadiiInnerShape(me._info_title);
			if (skin.rectHasRoundedCorners(me._info_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._info_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._info_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._info_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._info_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'info_title_geometry';
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
				geometry.name = 'info_title_geometry';
			}
			el.geometry = geometry;
		}
		me._info_title.userData.backgroundColorAlpha = 1;
		me._info_title.userData.borderColorAlpha = 1;
		me._info_title.userData.setOpacityInternal = function(v) {
			me._info_title.material.opacity = v;
			if (me._info_title.userData.hasScrollbar) {
				me._info_title.userData.scrollbar.material.opacity = v;
				me._info_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._info_title.userData.ggSubElement) {
				me._info_title.userData.ggSubElement.material.opacity = v
				me._info_title.userData.ggSubElement.visible = (v>0 && me._info_title.userData.visible);
			}
			me._info_title.visible = (v>0 && me._info_title.userData.visible);
		}
		me._info_title.userData.setBackgroundColor = function(v) {
			me._info_title.material.color = v;
		}
		me._info_title.userData.setBackgroundColorAlpha = function(v) {
			me._info_title.userData.backgroundColorAlpha = v;
			me._info_title.userData.setOpacity(me._info_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#000000';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 490;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._info_title;
			var canv = me._info_title.userData.textCanvas;
			var ctx = me._info_title.userData.textCanvasContext;
			var tmpCanv = me._info_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._info_title.userData.backgroundColor.r * 255 + ', ' + me._info_title.userData.backgroundColor.g * 255 + ', ' + me._info_title.userData.backgroundColor.b * 255 + ', ' + me._info_title.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._info_title.userData.scrollPosPercent ? tmpCanv.height * me._info_title.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'info_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._info_title.material.map) {
				me._info_title.material.map.dispose();
			}
			me._info_title.material.map = textTexture;
			me._info_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._info_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._info_title, 'box-sizing: border-box; width: 245px; height: auto; color: rgba(0,0,0,1); text-align: left; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me._info_title.userData.textColor + ' !important;', false, false, false);
			me._info_title.userData.hasScrollbar = false;
		}
		el.userData.ggUpdateText=function(force) {
			var params = [];
			var hs = player._("%S(hs)", params);
			if (hs!=this.ggText || force) {
				this.ggText=hs;
				this.ggRenderText();
			}
		}
		el.userData.setBackgroundColor = function(v) {
			me._info_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._info_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._info_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._info_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="info_title";
		me._info_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._info_title.logicBlock_text = function() {
			var newLogicStateText;
			if (
				((player.getVariableValue('info_w_picture_1') == Number("1")))
			)
			{
				newLogicStateText = 0;
			}
			else {
				newLogicStateText = -1;
			}
			if (me._info_title.ggCurrentLogicStateText != newLogicStateText) {
				me._info_title.ggCurrentLogicStateText = newLogicStateText;
				if (me._info_title.ggCurrentLogicStateText == 0) {
					if (me._info_title.userData.ggUpdateText) {
					me._info_title.userData.ggUpdateText=function(force) {
						var params = [];
						params.push(player._(String(player.hotspot.title)));
						var hs = player._("%1", params);
						if (hs!=this.ggText || force) {
							this.ggText=hs;
							this.ggRenderText();
						}
					}
					me._info_title.userData.ggUpdateText();
					} else {
						if (me._info_title.ggUpdatePosition) me._info_title.ggUpdatePosition();
					}
				}
				else {
					if (me._info_title.userData.ggUpdateText) {
					me._info_title.userData.ggUpdateText=function(force) {
						var params = [];
						var hs = player._("%S(hs)", params);
						if (hs!=this.ggText || force) {
							this.ggText=hs;
							this.ggRenderText();
						}
					}
					me._info_title.userData.ggUpdateText();
					} else {
						if (me._info_title.ggUpdatePosition) me._info_title.ggUpdatePosition();
					}
				}
			}
		}
		me._info_title.userData.ggUpdatePosition=function (useTransition) {
				me._info_title.userData.ggUpdateText(true);
		}
		me._information.add(me._info_title);
		el = new THREE.Mesh();
		el.translateX(1.54);
		el.translateY(1.8);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 32;
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
		el.name = 'info_popup_close';
		el.userData.x = 1.54;
		el.userData.y = 1.8;
		el.translateZ(0.090);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.090;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 2;
		el.userData.vanchor = 0;
		el.renderOrder = 9;
		el.userData.renderOrder = 9;
		el.userData.isVisible = function() {
			let vis = me._info_popup_close.visible
			let parentEl = me._info_popup_close.parent;
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
			me._info_popup_close.userData.opacity = v;
			v = v * me._info_popup_close.userData.parentOpacity;
			if (me._info_popup_close.userData.setOpacityInternal) me._info_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._info_popup_close.children.length; i++) {
				let child = me._info_popup_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._info_popup_close.userData.parentOpacity = v;
			v = v * me._info_popup_close.userData.opacity
			if (me._info_popup_close.userData.setOpacityInternal) me._info_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._info_popup_close.children.length; i++) {
				let child = me._info_popup_close.children[i];
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
		me._info_popup_close = el;
		el.userData.setOpacityInternal = function(v) {
			if (me._info_popup_close.userData.materialNormal) me._info_popup_close.userData.materialNormal.opacity = v;
			if (me._info_popup_close.userData.materialOver) me._info_popup_close.userData.materialOver.opacity = v;
			if (me._info_popup_close.userData.materialActive) me._info_popup_close.userData.materialActive.opacity = v;
			me._info_popup_close.visible = (v>0 && me._info_popup_close.userData.visible);
		}
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADz0lEQVR4nO2bMU8jRxTHf85dsUiXYPYDHC6CkC/ZlsIkcnn3MeCDJOerESjXWEoKCqgp6e201xp0iiIR4srNoeUiQML2pNi15PP58Lw3M2sn+C+9Cu3O/P7eZd97MwNLLbXUY1apwLFi4DvgW2Ad+AZ4lv/tH+AauAT+BM6ADwXOLYieAq+AJhnQEDCWMcyvaeb3eFLw3J30HDgAetgDz4pefs/nBXKIVQGOgHv8gU/GfT5GpRAiS60Ab4BbwoFPxg3QyMeeq74ne1eLAp+Ms3wOc9Eu2S8xL/jxp2E3MOtneu1h4r7j56DEY3pbEJAm3gbkBjKX5w05K34KBb+7AHC24f1/QkKxnznXuMHj12GF+X7qtHGGpzzhjWYC5XL5utVqtbe3t99rIWq12v'+
	't2u91eXV39qLxHwxW+guLRL5fL12madowxZjgcpvV6/Vx6j3q9fj4cDlNjjLm6uuooTbghqzzVOnKBH0lqwjj8SA4mHGnh1xEWNtPgpSZMg3c04R5lFXkgGWhtbS1N0/Rs2sRtTXgI3tGEAyn8UwT1vA38LBNs4B1M6CFsqrySOHx8fNyymfiXTJDAj3R6etqSzBF4KTGgKbl5tVq97Pf7PY0JGvh+v9+rVquXQgOaEgPEiU+SJBcaEzTwSZJcSOcHdGzhY2QNTCcTCoI3OVNsY8CPygGCmuAIP4ofbAxwrvp8m+AJ3gA7NgY0PAzkzQSP8AbL2kCUAIU0wTO8AfZtDPjN44AmSZKLwWAgNmEwGPiGN8Cvk7Bf2TjiojiOb0ulUiS9rlQqRXEc34aY0yx5ewU0Sc64tKX0A2H1CjQWAT6QCQ0bA5w/g77gA5iwY2OA'+
	'UyLkG96zCVaJkDoVDgXvyQTrVBgUxZC2qtNWkQoDrIshEJbDW1tbf2irOm0VWavVpN1mUTksaogcHh6KGiKTGZ7GhJOTk5bQAFFDRNQSi6LortvtvtPAa0zodrvvoii6E8CLW2IgTIhsTJiV29uYoIA3KJqioGiLP2SCbWHzkAlKeHVbHBQLI9NMkFZ100xQwhscFkYgWxoTb4MZN0Fb0o6b4ADvvDQGysXRKIru9vf32xsbG13N9YDZ3Nz8e29v73clvMHD4igsl8eBbLPBo90gMdJ/aYvMjm/4kR71JqmRFnmb3C8BuT/RIj4JwX/5SS3SVtmdsKhf1rw3S3fITqHMVStkCUfR2+VfA+J2e0hVKO7AxHoxSDo92iMzk3pC1oVpkr2r0kNTnfzalwQ8NFX0sbkXZMfmKsDXfHps7iPwF9mxuXP+B8fmllpqqcXXv4'+
	'iTKT6NVt3iAAAAAElFTkSuQmCC');
		texture.colorSpace = player.getVRTextureColorSpace();
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'info_popup_close_material';
		el.userData.materialNormal = material;
		el.userData.materialCurrent = material;
		textureOver = loader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFAUlEQVR4nO2bwU4bVxSGf0e68iAHldjGwhkMMihNNiVZJIv6EXiD9ilYFnZ0AYJF8xQtgl26zAqSqlIXbTDBNgSwQJUtLARI8VCbGTrTxcwoYzT2zNxzPbbl/tJZWIjj+/2emXvnnHuBIVckpO+RAHwD4IkVjwGMAnho/V0BUAdQBXBkxR6A25DG1xW9APAjgHcAmgCMgNEEsANg2co1EIoDWARQRHBgryhYueOh0QSQDOA1zEtZNPj9UKzvkkMh81AUwBLCAXczYskaQ0+Ug/mwChv8fhwB+LbLrC16ANN5TSAENTSYz4euz2ojAH7tIahXvLHG2BWNAfitDyC94r01VqF6BGC3D+D8xq5IE0YwGL+825VAvh0iMO+rXsPwxhsQH4yLfQBBjR944X'+
	'Por6mONzRwrBOiIC5yUqnUTTQavaMCRCIRY3Jy8jMxzxECrhiXKF84Pz9/ouu6oijKYSqVuuTNwxgz8vn8B8Mw9PX19XdEExb9wssgrO0t+H8MS7wmMMaM/f39D4ZDa2trFBMUmHUIT70WBe80IZlMXlHgBZnwkxd8HJy/fjv4oCZ0gre1urrKa0IdHvUErmnPC96vCYwx3Qve1srKCq8JHZ8FgSs5fuEdJhy4mRAEnmhCoR38i6DJYrGYput6Pcig3UxgjOmFQuGvoHkMwzByudwehwnP3QxYDpqIMaY3Go0yz8Dr9fpBIpG4psDf3d2djo2NnXMYsOxmwA5HIkOW5Vqz2eQ2oVQq8cKfZLPZTzxjBrB9H14CX+naacIJDwiPNE37lMlkDnnHC6CBeyvDV4RkoZqgqmpJlmUKvB0vAbO+B5jdGpIqlUpqZmZm9Pb2'+
	'tkzN1U6apu1PTU1FKpXK1wLSPQEEGgAA1Wp1vFsmaJqWl2WZnZ+fPxWUssUAX2tkP7JNaDabwkxQVfXPdDotXVxciIIHrMaKbcCowMSoVqvjs7OzQkxQVfWPiYmJ2OXlpUh4wGrMPnB+ECkRJqiq+vv4+PhX19fXz0SOzVKLAV3R1dVVolarKbz/r2lanDGWEjmmdvoF9GmlJSRJ+rdcLu9Spz1FUUqJRIK7qNIhfga+XAF1kW5KkqQXi8WP2WzWdc0dRLFY7NnZ2dmF9e4gUgrwxYCqqKwi4W3FYrGnp6enok2oOD98jz667DvcDgfJZFLU7fCd0wDyUrjb8A4TDgWZ8NJpAOllKCx4pwmUajNcXoYAztdhCvzNzc0e76s00YTt+/AAR0EkEokYx8fHeU74fDwer1HqCYqiHEaj0QaHAa4FkcAlsenp6c8UeDsPwQ'+
	'Q1k8mUOQxoO0MVgibb2trapsATTNAWFhbecsC3LYoCnGVxvya0g+cwgRfegEdZnLsx4mWCF3wAEyjwno0RgNAa29zcdDXBL7wPEyjwBny0xgBic3RjY2ObAt/BBCq87+YoQGyP2ybwwruYoBLhDQRojwMCNkjMzc0VGWM3xEEbkiQp6XT6b2KewBskgCHfImNrqDdJAf9vkwNgbjZ83wcwQUPIRklbYxjirbJOEwbhSujKZmlbI+jvZ0JXt8vbisCcHfppitRgPu3DOgYIwJxbh/LIjFNRmFdDrw5NLaKHh6acegzzTauO7oPXre8S1tEWKfvgZODKko8owLzPH4VGQ9RzmMXHHfCV3Bswq7fL6FDDoyqsp2YUrYenZZjtaefhaQVmu8o+PP0RA354eiD0H8RT3laRsepMAAAAAElFTkSuQmCC');
		textureOver.colorSpace = player.getVRTextureColorSpace();
		el.userData.materialOver = new THREE.MeshBasicMaterial( {map: textureOver, side: THREE.DoubleSide, transparent: true} );
		el.userData.materialOver.name = 'info_popup_close_materialOver';
		el.userData.createGeometry = function(brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._info_popup_close;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			let minDim = Math.min(el.userData.width, el.userData.height) / 2;
			el.userData.borderRadiusInnerShape.topLeft = Math.min(brTopLeft, minDim);
			el.userData.borderRadiusInnerShape.topRight = Math.min(brTopRight, minDim);
			el.userData.borderRadiusInnerShape.bottomRight = Math.min(brBottomRight, minDim);
			el.userData.borderRadiusInnerShape.bottomLeft = Math.min(brBottomLeft, minDim);
		geometry = new THREE.PlaneGeometry(me._info_popup_close.userData.width / 100.0, me._info_popup_close.userData.height / 100.0, 5, 5 );
		geometry.name = 'info_popup_close_geometry';
		el.geometry = geometry;
		el.material = el.userData.materialCurrent;
		}
		el.userData.createGeometry(0, 0, 0, 0);
		el.userData.ggId="info_popup_close";
		me._info_popup_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return player.getCurrentNode();
		}
		me._info_popup_close.userData.onclick=function (e) {
			player.setVariableValue('info_w_picture_1', Number("0"));
		}
		me._info_popup_close.userData.hasOwnClickAction = true;
		me._info_popup_close.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			me._info_popup_close.material = me._info_popup_close.userData.materialCurrent = me._info_popup_close.userData.materialOver;
			me.elementMouseOver['info_popup_close']=true;
		}
		me._info_popup_close.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me._info_popup_close.material = me._info_popup_close.userData.materialCurrent = me._info_popup_close.userData.materialNormal;
			me.elementMouseOver['info_popup_close']=false;
		}
		me._info_popup_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._information.add(me._info_popup_close);
		me.skinGroup.add(me._information);
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
		me._page_up_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._page_up_bg.traverse((obj)=>{
				if (me._page_up_bg.material) {
					me._page_up_bg.material.transparent = (me._page_up_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['page_up_bg']=false;
		me._page_up_bg.logicBlock_scaling();
		me._page_up_bg.logicBlock_visible();
		me._page_up.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._page_up.traverse((obj)=>{
				if (me._page_up.material) {
					me._page_up.material.transparent = (me._page_up.userData.zIndexCurrent > 0);
					}
			});
		}
		me._page_down_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._page_down_bg.traverse((obj)=>{
				if (me._page_down_bg.material) {
					me._page_down_bg.material.transparent = (me._page_down_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['page_down_bg']=false;
		me._page_down_bg.logicBlock_scaling();
		me._page_down_bg.logicBlock_visible();
		me._page_down.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._page_down.traverse((obj)=>{
				if (me._page_down.material) {
					me._page_down.material.transparent = (me._page_down.userData.zIndexCurrent > 0);
					}
			});
		}
		if (player.get3dModelType() == 2) {
			me.__close_skin.traverse((obj)=>{
				if (me.__close_skin.material) {
					me.__close_skin.material.transparent = (me.__close_skin.userData.zIndexCurrent > 0);
					}
			});
		}
		me._exit_vr.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._exit_vr.traverse((obj)=>{
				if (me._exit_vr.material) {
					me._exit_vr.material.transparent = (me._exit_vr.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['exit_vr']=false;
		me._exit_vr.logicBlock_scaling();
		me._exit_vr_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._exit_vr_icon.traverse((obj)=>{
				if (me._exit_vr_icon.material) {
					me._exit_vr_icon.material.transparent = (me._exit_vr_icon.userData.zIndexCurrent > 0);
					}
			});
		}
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
		me._close_skin_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._close_skin_icon.traverse((obj)=>{
				if (me._close_skin_icon.material) {
					me._close_skin_icon.material.transparent = (me._close_skin_icon.userData.zIndexCurrent > 0);
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
		me._open_skin_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._open_skin_icon.traverse((obj)=>{
				if (me._open_skin_icon.material) {
					me._open_skin_icon.material.transparent = (me._open_skin_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me._information.traverse((obj)=>{
			let level = skin.getDepthFrom(me._information, obj);
			let treePos = obj.parent ? obj.parent.children.indexOf(obj) : 0;
			if (10 > 0) {
				if (obj == me._information) {
					obj.renderOrder = 10000 + 1000*10
				} else {
					let parentOrder = obj.parent.renderOrder;
					let isSkinElement = obj.userData.hasOwnProperty('ggId');
					obj.renderOrder = parentOrder + (isSkinElement ? (treePos * 100) : 0) + level;
				}
			} else {
				obj.renderOrder = me._information.userData.renderOrder + level;
			}
			if (obj.material) {
				if (player.get3dModelType() != 2) {
					obj.material.depthTest = false;
					obj.material.depthWrite = false;
				} else {
					obj.material.transparent = true;
				}
			}
		});
		player.repaint();
		me._information.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._information.traverse((obj)=>{
				if (me._information.material) {
					me._information.material.transparent = (me._information.userData.zIndexCurrent > 0);
					}
			});
		}
		me._information.logicBlock_scaling();
		me._information.logicBlock_visible();
		me._information_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._information_bg.traverse((obj)=>{
				if (me._information_bg.material) {
					me._information_bg.material.transparent = (me._information_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._info_text_body.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._info_text_body.traverse((obj)=>{
				if (me._info_text_body.material) {
					me._info_text_body.material.transparent = (me._info_text_body.userData.zIndexCurrent > 0);
					}
			});
		}
			me._info_text_body.userData.ggUpdateText(true);
		me._popup_imagen.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._popup_imagen.traverse((obj)=>{
				if (me._popup_imagen.material) {
					me._popup_imagen.material.transparent = (me._popup_imagen.userData.zIndexCurrent > 0);
					}
			});
		}
		me._popup_imagen.logicBlock_visible();
		me._info_title.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._info_title.traverse((obj)=>{
				if (me._info_title.material) {
					me._info_title.material.transparent = (me._info_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._info_title.userData.ggUpdateText(true);
		me._info_title.logicBlock_text();
		me._info_popup_close.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._info_popup_close.traverse((obj)=>{
				if (me._info_popup_close.material) {
					me._info_popup_close.material.transparent = (me._info_popup_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['info_popup_close']=false;
		me.eventactivehotspotchangedCallback = function() {
			for(var i = 0; i < me._node_cloner_vr.userData.ggInstances.length; i++) {
				me._node_cloner_vr.userData.ggInstances[i].ggEvent_activehotspotchanged();
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_node__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_node__3d'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_activehotspotchanged();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_activehotspotchanged();
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
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_node__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_node__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_changenode();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_changenode();
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
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image_1__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image_1__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image_1__3d'][i].ggEvent_changenode();
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
				me._page_up_bg.traverse((obj)=>{
					if (me._page_up_bg.material) {
						me._page_up_bg.material.transparent = (me._page_up_bg.userData.zIndexCurrent > 0);
						}
				});
			}
			me._page_up_bg.logicBlock_visible();
			if (player.get3dModelType() == 2) {
				me._page_up.traverse((obj)=>{
					if (me._page_up.material) {
						me._page_up.material.transparent = (me._page_up.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._page_down_bg.traverse((obj)=>{
					if (me._page_down_bg.material) {
						me._page_down_bg.material.transparent = (me._page_down_bg.userData.zIndexCurrent > 0);
						}
				});
			}
			me._page_down_bg.logicBlock_visible();
			if (player.get3dModelType() == 2) {
				me._page_down.traverse((obj)=>{
					if (me._page_down.material) {
						me._page_down.material.transparent = (me._page_down.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me.__close_skin.traverse((obj)=>{
					if (me.__close_skin.material) {
						me.__close_skin.material.transparent = (me.__close_skin.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._exit_vr.traverse((obj)=>{
					if (me._exit_vr.material) {
						me._exit_vr.material.transparent = (me._exit_vr.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._exit_vr_icon.traverse((obj)=>{
					if (me._exit_vr_icon.material) {
						me._exit_vr_icon.material.transparent = (me._exit_vr_icon.userData.zIndexCurrent > 0);
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
				me._close_skin_icon.traverse((obj)=>{
					if (me._close_skin_icon.material) {
						me._close_skin_icon.material.transparent = (me._close_skin_icon.userData.zIndexCurrent > 0);
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
				me._open_skin.traverse((obj)=>{
					if (me._open_skin.material) {
						me._open_skin.material.transparent = (me._open_skin.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._open_skin_icon.traverse((obj)=>{
					if (me._open_skin_icon.material) {
						me._open_skin_icon.material.transparent = (me._open_skin_icon.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._information.traverse((obj)=>{
					if (me._information.material) {
						me._information.material.transparent = (me._information.userData.zIndexCurrent > 0);
						}
				});
			}
			me._information.logicBlock_visible();
			if (player.get3dModelType() == 2) {
				me._information_bg.traverse((obj)=>{
					if (me._information_bg.material) {
						me._information_bg.material.transparent = (me._information_bg.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._info_text_body.traverse((obj)=>{
					if (me._info_text_body.material) {
						me._info_text_body.material.transparent = (me._info_text_body.userData.zIndexCurrent > 0);
						}
				});
			}
			if (player.get3dModelType() == 2) {
				me._popup_imagen.traverse((obj)=>{
					if (me._popup_imagen.material) {
						me._popup_imagen.material.transparent = (me._popup_imagen.userData.zIndexCurrent > 0);
						}
				});
			}
			me._popup_imagen.logicBlock_visible();
			if (player.get3dModelType() == 2) {
				me._info_title.traverse((obj)=>{
					if (me._info_title.material) {
						me._info_title.material.transparent = (me._info_title.userData.zIndexCurrent > 0);
						}
				});
			}
			me._info_title.logicBlock_text();
			if (player.get3dModelType() == 2) {
				me._info_popup_close.traverse((obj)=>{
					if (me._info_popup_close.material) {
						me._info_popup_close.material.transparent = (me._info_popup_close.userData.zIndexCurrent > 0);
						}
				});
			}
		};
		player.addListener('changenode', me.eventchangenodeCallback);
		me.eventconfigloadedCallback = function() {
			for(var i = 0; i < me._node_cloner_vr.userData.ggInstances.length; i++) {
				me._node_cloner_vr.userData.ggInstances[i].ggEvent_configloaded();
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_node__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_node__3d'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_configloaded();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_configloaded();
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
			me._page_up_bg.logicBlock_visible();
			me._page_down_bg.logicBlock_visible();
			me._information.logicBlock_visible();
			me._popup_imagen.logicBlock_visible();
			me._info_title.logicBlock_text();
		};
		player.addListener('configloaded', me.eventconfigloadedCallback);
		me.eventvarchanged_info_w_picture_1Callback = function() {
			me._information.logicBlock_visible();
			me._popup_imagen.logicBlock_visible();
			me._info_title.logicBlock_text();
		};
		player.addListener('varchanged_info_w_picture_1', me.eventvarchanged_info_w_picture_1Callback);
		me.eventvarchanged_node_cloner_vr_hasDownCallback = function() {
			me._page_down_bg.logicBlock_visible();
		};
		player.addListener('varchanged_node_cloner_vr_hasDown', me.eventvarchanged_node_cloner_vr_hasDownCallback);
		me.eventvarchanged_node_cloner_vr_hasUpCallback = function() {
			me._page_up_bg.logicBlock_visible();
		};
		player.addListener('varchanged_node_cloner_vr_hasUp', me.eventvarchanged_node_cloner_vr_hasUpCallback);
		me.eventvarchanged_open_image_hsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_image__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_image__3d'][i].ggEvent_varchanged_open_image_hs();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_varchanged_open_image_hs();
				}
			}
		};
		player.addListener('varchanged_open_image_hs', me.eventvarchanged_open_image_hsCallback);
		me.eventvarchanged_open_info_hsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_info__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_info__3d'][i].ggEvent_varchanged_open_info_hs();
				}
			}
		};
		player.addListener('varchanged_open_info_hs', me.eventvarchanged_open_info_hsCallback);
		me.eventvarchanged_open_video_hsCallback = function() {
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_file__3d'][i].ggEvent_varchanged_open_video_hs();
				}
			}
			if (hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				for(var i = 0; i < hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].length; i++) {
					hotspotTemplates['SkinHotspotClass_ht_video_url__3d'][i].ggEvent_varchanged_open_video_hs();
				}
			}
		};
		player.addListener('varchanged_open_video_hs', me.eventvarchanged_open_video_hsCallback);
	};
	this.removeSkin=function() {
	};
	function SkinHotspotClass_ht_image_1__3d(parentScope,hotspot) {
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
			me._ht_image_1.visible = (v>0 && me._ht_image_1.userData.visible);
		}
		el.userData.width = 0;
		el.userData.height = 0;
		el.name = 'ht_image_1';
		el.userData.x = -2.13;
		el.userData.y = 0.28;
		el.translateZ(0.000);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.000;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 0;
		el.userData.renderOrder = 0;
		el.userData.isVisible = function() {
			let vis = me._ht_image_1.visible
			let parentEl = me._ht_image_1.parent;
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
			me._ht_image_1.userData.opacity = v;
			v = v * me._ht_image_1.userData.parentOpacity;
			if (me._ht_image_1.userData.setOpacityInternal) me._ht_image_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_1.children.length; i++) {
				let child = me._ht_image_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_1.userData.parentOpacity = v;
			v = v * me._ht_image_1.userData.opacity
			if (me._ht_image_1.userData.setOpacityInternal) me._ht_image_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_1.children.length; i++) {
				let child = me._ht_image_1.children[i];
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
		me._ht_image_1 = el;
		el.userData.ggId="ht_image_1";
		me._ht_image_1.userData.ggIsActive=function() {
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
		me._ht_image_1.userData.onclick=function (e) {
			skin._popup_imagen.userData.ggSetUrl(player.getBasePath()+""+player._(me.hotspot.url));
				skin._info_text_body.userData.ggUpdateText=function(force) {
					var params = [];
					params.push(player._(String(player._(me.hotspot.description))));
					var hs = player._("%1", params);
					if (hs!=this.ggText || force) {
						this.ggText=hs;
						this.ggRenderText();
					}
				}
			skin._info_text_body.userData.ggUpdateText();
				skin._info_title.userData.ggUpdateText=function(force) {
					var params = [];
					params.push(player._(String(player._(me.hotspot.title))));
					var hs = player._("%1", params);
					if (hs!=this.ggText || force) {
						this.ggText=hs;
						this.ggRenderText();
					}
				}
			skin._info_title.userData.ggUpdateText();
			player.setVariableValue('info_w_picture_1', Number(player._(me.hotspot.target)));
			player.triggerEvent('hsproxyclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image_1.userData.hasOwnClickAction = true;
		me._ht_image_1.userData.ondblclick=function (e) {
			player.triggerEvent('hsproxydblclick', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image_1.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			player.setActiveHotspot(me.hotspot);
			me.elementMouseOver['ht_image_1']=true;
			me._tt_information.logicBlock_visible();
			player.triggerEvent('hsproxyover', {'id': me.hotspot.id, 'url': me.hotspot.url});
		}
		me._ht_image_1.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me.elementMouseOver['ht_image_1']=false;
			me._tt_information.logicBlock_visible();
			player.triggerEvent('hsproxyout', {'id': me.hotspot.id, 'url': me.hotspot.url});
			player.setActiveHotspot(null);
		}
		me._ht_image_1.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
		el.translateX(0);
		el.translateY(0.01);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 32;
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
		el.name = 'ht_info_image_1';
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
			let vis = me._ht_info_image_1.visible
			let parentEl = me._ht_info_image_1.parent;
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
			me._ht_info_image_1.userData.opacity = v;
			v = v * me._ht_info_image_1.userData.parentOpacity;
			if (me._ht_info_image_1.userData.setOpacityInternal) me._ht_info_image_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_image_1.children.length; i++) {
				let child = me._ht_info_image_1.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_image_1.userData.parentOpacity = v;
			v = v * me._ht_info_image_1.userData.opacity
			if (me._ht_info_image_1.userData.setOpacityInternal) me._ht_info_image_1.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_image_1.children.length; i++) {
				let child = me._ht_info_image_1.children[i];
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
		me._ht_info_image_1 = el;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_info_image_1.userData.materialNormal) me._ht_info_image_1.userData.materialNormal.opacity = v;
			if (me._ht_info_image_1.userData.materialOver) me._ht_info_image_1.userData.materialOver.opacity = v;
			if (me._ht_info_image_1.userData.materialActive) me._ht_info_image_1.userData.materialActive.opacity = v;
			me._ht_info_image_1.visible = (v>0 && me._ht_info_image_1.userData.visible);
		}
		loader = new THREE.TextureLoader();
		texture = loader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEAElEQVR4nO2bT08TQRjGf1SBWLMqRg8mYjkB8awhwXJRuOhn4ABeOXEUvWA9+Cdo4oWAJxM/gpzUeMDEqIlBoagHGiRy0Bj/IHXbIuthlgTb2U7bnZkt2F8yl93pzvO8nZmd2X0XGjRo8D/TZLGtNqAb6ATagYPAAf/cT+AHsAJ8AN4B3yxqM8IeYAC4A7wBNgGvwrLp/+aOf42YZe2haAduAJ+o3LCqfPKv2W7RR9UkgHtAHn3Gi0sOmPbbqhtagctAFnPGi8s6MAa0WPBXlg5gDnvGi8scEfaGPuCzQqCN8hlIGvZawjBiPEZtfvvcMGzU8TZSFgzVWlIGfQNwsQ5MqkpVPaGalWAf8IiQM6/jOOsTExOvkslkc3NzcwygUChszs7OFkZHR0+tra'+
	'3tD3N9xG34HDAb8jr/0IGGCc9xnF+u6y55Abiuu+Q4zq+w7fhaE7rMt6DpVjc9Pf00yPwWU1NTT3W05WvWsk4Y0yTIS6fTz1QBSKfTz3S1B1xSmVNtMhJ+ALSwNebD1qmCMRRDQdXYFWCfLjXLy8t5VZ1MJpPT1R4QRyzTa6IdzRub3t7e957nFcqMgHxPT897nW0iFkk17SJvaBbiAd7Q0NBL13UzkjtAZnBw8IWJNn0vUoLWAXsQT2eOVR6v6ojH49nW1tYNgFwutzebzcZNtQWsInrBZqU/GMDMPxFlGZAZDZoEL1QWpx3FednBoACcNSgkKqSeZHNAG/A14NxOxgMOA9+3H5T1gG52n3kQnrqLD+6VVOw0paC/v/91KpVaIzjA3vj4+JGZmZmThiR0As9VlS5jaCaen59/otoLLC4umloLeEiW9bIhcFAVoVqJ'+
	'xWLKodXU1GRy+JV4kwXggOTYbqHE24565WQCWQB+WldhjxJvsgD8sCAkKkq8yQKwYkFIVJR4kwXggwUhUVHiTRaAd4h75m7DQ3j7B1kAvgHzxuXY5y1F+wAIvg0+MaslEqSeggLw0KCQqJiRHSzXA1bNabHOKvBYdiIoAH+AB8bk2OcBAc8Dyy2F7wIFI3Lskkd4kVIuACvAfe1y7HOfMos71WboKvBbqxy7ZBEeAlEFYBm4pk2Ofa4BH8tVqGQ7fBORtRmafD6vXGFubGxU/PJCwRvglqpSpU9fOoAXwNEQgujq6loaGRlZCXrq43meNzk5mVhYWOgI0w7wBTiN6MHa6KO+MsOCSg6DaXPDdWBQVYyny9VzmlzZGV8n9ZgoOWTUsYQk9ZMqe8aw10AS/MfJ0lu0IN64rGPP+DoiAyzydPntJBAfM5icG3LAFHDCkq'+
	'eaMPXJzHXguEUfoYkh0lJuI8ZqtR9Nzfm/7cfgGyybeQCHqO6zuZIHmA0aNGigm7/sybtWWi4E2AAAAABJRU5ErkJggg==');
		texture.colorSpace = player.getVRTextureColorSpace();
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_info_image_1_material';
		el.userData.materialNormal = material;
		el.userData.materialCurrent = material;
		textureOver = loader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEZ0lEQVR4nO2bTW8bRRzGf7u0LrS1QGmTEEs5JIoap5dIEYUTSOTKS74EXwEEBazkAgogKpETgkvgG0BFBRIqLweIocqFpHkBgQwhSt1DqF8bx7scZtdxV17vrjOzs0n6k/4Hr9ee53l27Z2dnYETjhFTO48Bl4EscAkYBNJOAZSc2gE2gDVgFajFpE8JTwFzwA/AfcCOWPedz84533Uk6AfeQBy9qIaDatX57v7Y3EQgA1wDKsg37q2K01YmFmcBnAHeBqqoN+6tKvCWo0ELzyL+sOI27q0NR0tsmIijvi/RxGFrH3E2mAp9A3AeuKHRaFDdAM6pMn8RWEqAyaBaAi7INn8BWEmAubC1IjOEs8DPCTAVtX5ytHclqCtsAF8ALwZ9UVjGxsa2ZmdnNy'+
	'cnJ08bhmEANJtNe3l5uZHL5bKFQuFJWW0B14GXEYH0xFUkHpWZmZlly7LKtg+WZe1OT0//JrNNRO+xJ55D4qXOMAyr0Wj842fepVarbUoOYN/xEokzgFQhExMTfwWZd8lkMjuSQ9jEp8fo13F4DRiLmlo3MplMOey+Q0ND92S2jfDyaqc3OgWQ4RC/Gz+q1eojEfY9Lbt9xP9ZqBuoa8g9/WzATqVSddu2q0Gnv2VZ90zTbKrQAHwYZL4fhbe0i4uL3wYFsLCw8J2q9h1vF7sF8LrCxm3Anp+f/75cLq/btl2xbbvuVKVUKq3lcrkfVbfvePTldgwCdNeqn/krCRAXV11xTbdfBV7yS+YY0uratwfwvAYhumh5dW+GzgK7gIrrbxLZA54Aau4ZcJmTYx4ghfDMKWfDeBytmqZppVKpRrd9Go3GqWazGbrXeAjGgVtu'+
	'AJdUt9bX17dbLBYt0zT7uu1n2/Z/w8PD9a2trUHFksbh4E9QdWOMjIzcDTIPYBjG49ls9q5qPcAAHASQ7rLjcSUNDwNQ/yAh6bgBlLSq0EMJHgbQCmBHoxBd3IGDADY0CtHFOhwEsK5RiC4eCGAVcYNwUtjDGRhxA6gCeW1y4mcJZwZaez/gph4tWmh5bQ/gugYhumh5bQ8gz8m4GtwGfnFfeLvCn8erRQuftb/wBvAJUI9PS+xUgU/bN3gD2PHucMz4GHhgrKHT3eB7iHm6x40a8IF3Y6cA/gbmlcuJn3eAf70b/cYD3gX+VConXjaB9zu94RdAHXgFsGQpKBaL5xGPpQLZ3t6WOdmxifDS8WcdNEtsDsjJUjI1NfX76Oho17GHQqFwLp/Pyxylvoo4o3vCBL5B/8PMXutLJKyKSQO3EmAmaoWaKBmWAZIxNT5srQ'+
	'CBzyB6CeEonAlKJku7pIGvE2DSr75C4XR5FxOYRVxedBt2ax94k5ifc0wDf0g00WvFvmSmnUcRfYV6F4Gqqoo46inlLkMwDHxEPKvHKogJj4lYNudlEHFU1pBv3F042XWiY1RUrh1+GngBMSHpGaKfqnuIlSo3EWN4v0pV5xD34ulxpwbovHj6DuKBxRpi7O5IL54+EvwPgHiiBLWkN8oAAAAASUVORK5CYII=');
		textureOver.colorSpace = player.getVRTextureColorSpace();
		el.userData.materialOver = new THREE.MeshBasicMaterial( {map: textureOver, side: THREE.DoubleSide, transparent: true} );
		el.userData.materialOver.name = 'ht_info_image_1_materialOver';
		el.userData.createGeometry = function(brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_image_1;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			let minDim = Math.min(el.userData.width, el.userData.height) / 2;
			el.userData.borderRadiusInnerShape.topLeft = Math.min(brTopLeft, minDim);
			el.userData.borderRadiusInnerShape.topRight = Math.min(brTopRight, minDim);
			el.userData.borderRadiusInnerShape.bottomRight = Math.min(brBottomRight, minDim);
			el.userData.borderRadiusInnerShape.bottomLeft = Math.min(brBottomLeft, minDim);
		geometry = new THREE.PlaneGeometry(me._ht_info_image_1.userData.width / 100.0, me._ht_info_image_1.userData.height / 100.0, 5, 5 );
		geometry.name = 'ht_info_image_1_geometry';
		el.geometry = geometry;
		el.material = el.userData.materialCurrent;
		}
		el.userData.createGeometry(0, 0, 0, 0);
		el.userData.ggId="ht_info_image_1";
		me._ht_info_image_1.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_image_1.userData.onmouseenter=function (e) {
			player.setOverrideCursor('pointer');
			me._ht_info_image_1.material = me._ht_info_image_1.userData.materialCurrent = me._ht_info_image_1.userData.materialOver;
			me.elementMouseOver['ht_info_image_1']=true;
		}
		me._ht_info_image_1.userData.onmouseleave=function (e) {
			player.setOverrideCursor('default');
			me._ht_info_image_1.material = me._ht_info_image_1.userData.materialCurrent = me._ht_info_image_1.userData.materialNormal;
			me.elementMouseOver['ht_info_image_1']=false;
		}
		me._ht_info_image_1.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_image_1.add(me._ht_info_image_1);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'tt_information_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.3);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'tt_information';
		el.userData.x = 0;
		el.userData.y = -0.3;
		el.translateZ(2.020);
		el.userData.zIndex = 100;
		el.userData.zIndexCurrent = 100;
		el.userData.z = 0.020;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 2;
		el.userData.renderOrder = 2;
		el.userData.isVisible = function() {
			let vis = me._tt_information.visible
			let parentEl = me._tt_information.parent;
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
			me._tt_information.userData.opacity = v;
			v = v * me._tt_information.userData.parentOpacity;
			if (me._tt_information.userData.setOpacityInternal) me._tt_information.userData.setOpacityInternal(v);
			for (let i = 0; i < me._tt_information.children.length; i++) {
				let child = me._tt_information.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._tt_information.userData.parentOpacity = v;
			v = v * me._tt_information.userData.opacity
			if (me._tt_information.userData.setOpacityInternal) me._tt_information.userData.setOpacityInternal(v);
			for (let i = 0; i < me._tt_information.children.length; i++) {
				let child = me._tt_information.children[i];
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
		me._tt_information = el;
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
			let el = me._tt_information;
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
			skin.rectCalcBorderRadiiInnerShape(me._tt_information);
			if (skin.rectHasRoundedCorners(me._tt_information)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._tt_information.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._tt_information.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._tt_information.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._tt_information.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'tt_information_geometry';
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
				geometry.name = 'tt_information_geometry';
			}
			el.geometry = geometry;
		}
		me._tt_information.userData.backgroundColorAlpha = 0.666667;
		me._tt_information.userData.borderColorAlpha = 1;
		me._tt_information.userData.setOpacityInternal = function(v) {
			me._tt_information.material.opacity = v;
			if (me._tt_information.userData.hasScrollbar) {
				me._tt_information.userData.scrollbar.material.opacity = v;
				me._tt_information.userData.scrollbarBg.material.opacity = v;
			}
			if (me._tt_information.userData.ggSubElement) {
				me._tt_information.userData.ggSubElement.material.opacity = v
				me._tt_information.userData.ggSubElement.visible = (v>0 && me._tt_information.userData.visible);
			}
			me._tt_information.visible = (v>0 && me._tt_information.userData.visible);
		}
		me._tt_information.userData.setBackgroundColor = function(v) {
			me._tt_information.material.color = v;
		}
		me._tt_information.userData.setBackgroundColorAlpha = function(v) {
			me._tt_information.userData.backgroundColorAlpha = v;
			me._tt_information.userData.setOpacity(me._tt_information.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#000000');
		el.userData.textColor = '#ffffff';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._tt_information;
			var canv = me._tt_information.userData.textCanvas;
			var ctx = me._tt_information.userData.textCanvasContext;
			var tmpCanv = me._tt_information.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._tt_information.userData.backgroundColor.r * 255 + ', ' + me._tt_information.userData.backgroundColor.g * 255 + ', ' + me._tt_information.userData.backgroundColor.b * 255 + ', ' + me._tt_information.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._tt_information.userData.scrollPosPercent ? tmpCanv.height * me._tt_information.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._tt_information.userData.boxWidthCanv / 100.0;
		height = me._tt_information.userData.boxHeightCanv / 100.0;
		me._tt_information.userData.width = me._tt_information.userData.boxWidthCanv;
		me._tt_information.userData.height = me._tt_information.userData.boxHeightCanv;
		me._tt_information.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._tt_information, -50, 20);
		me._tt_information.position.x = newPos.x;
		me._tt_information.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'tt_information_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._tt_information.material.map) {
				me._tt_information.material.map.dispose();
			}
			me._tt_information.material.map = textTexture;
			me._tt_information.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._tt_information, 'scrollbar');
			skin.paintTextDivToCanvas(me._tt_information, 'box-sizing: border-box; width: auto; height: auto; color: rgba(255,255,255,1); text-align: center; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me._tt_information.userData.textColor + ' !important;', false, true, false);
			me._tt_information.userData.hasScrollbar = false;
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
			me._tt_information.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._tt_information.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._tt_information.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._tt_information.userData.textColorAlpha = v;
		}
		el.userData.ggId="tt_information";
		me._tt_information.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._tt_information.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.elementMouseOver['ht_image_1'] == true))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._tt_information.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._tt_information.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._tt_information.ggCurrentLogicStateVisible == 0) {
			me._tt_information.visible=((!me._tt_information.material && Number(me._tt_information.userData.opacity>0)) || (me._tt_information.material && Number(me._tt_information.material.opacity)>0))?true:false;
			player.repaint();
			me._tt_information.userData.visible=true;
				}
				else {
			me._tt_information.visible=false;
			player.repaint();
			me._tt_information.userData.visible=false;
				}
			}
		}
		me._tt_information.userData.ggUpdatePosition=function (useTransition) {
				me._tt_information.userData.ggUpdateText(true);
		}
		me._ht_image_1.add(me._tt_information);
		me._ht_image_1.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_1.traverse((obj)=>{
				if (me._ht_image_1.material) {
					me._ht_image_1.material.transparent = (me._ht_image_1.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_image_1']=false;
		me._ht_info_image_1.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_image_1.traverse((obj)=>{
				if (me._ht_info_image_1.material) {
					me._ht_info_image_1.material.transparent = (me._ht_info_image_1.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_info_image_1']=false;
		me._tt_information.traverse((obj)=>{
			let level = skin.getDepthFrom(me._tt_information, obj);
			let treePos = obj.parent ? obj.parent.children.indexOf(obj) : 0;
			if (100 > 0) {
				if (obj == me._tt_information) {
					obj.renderOrder = 10000 + 1000*100
				} else {
					let parentOrder = obj.parent.renderOrder;
					let isSkinElement = obj.userData.hasOwnProperty('ggId');
					obj.renderOrder = parentOrder + (isSkinElement ? (treePos * 100) : 0) + level;
				}
			} else {
				obj.renderOrder = me._tt_information.userData.renderOrder + level;
			}
			if (obj.material) {
				if (player.get3dModelType() != 2) {
					obj.material.depthTest = false;
					obj.material.depthWrite = false;
				} else {
					obj.material.transparent = true;
				}
			}
		});
		player.repaint();
		me._tt_information.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._tt_information.traverse((obj)=>{
				if (me._tt_information.material) {
					me._tt_information.material.transparent = (me._tt_information.userData.zIndexCurrent > 0);
					}
			});
		}
			me._tt_information.userData.ggUpdateText(true);
		me._tt_information.logicBlock_visible();
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._ht_image_1.traverse((obj)=>{
						if (me._ht_image_1.material) {
							me._ht_image_1.material.transparent = (me._ht_image_1.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_info_image_1.traverse((obj)=>{
						if (me._ht_info_image_1.material) {
							me._ht_info_image_1.material.transparent = (me._ht_info_image_1.userData.zIndexCurrent > 0);
							}
					});
				}
					me._tt_information.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._tt_information.traverse((obj)=>{
						if (me._tt_information.material) {
							me._tt_information.material.transparent = (me._tt_information.userData.zIndexCurrent > 0);
							}
					});
				}
			};
			me.__obj = me._ht_image_1;
			me.__obj.userData.hotspot = hotspot;
			me.__obj.userData.fromSkin = true;
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
		el.userData.x = 3.28;
		el.userData.y = 2.08;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_url_bg_material';
			el.material = material;
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
		el.name = 'ht_video_url_bg';
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
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
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
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
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
		me._ht_video_url_bg.userData.backgroundColorAlpha = 0.588235;
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
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
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
				((me.elementMouseOver['ht_video_url_bg'] == true))
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
					me._ht_video_url_bg.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
		me._ht_video_url_bg.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage == ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_bg.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_bg.visible=((!me._ht_video_url_bg.material && Number(me._ht_video_url_bg.userData.opacity>0)) || (me._ht_video_url_bg.material && Number(me._ht_video_url_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_bg.userData.visible=true;
				}
				else {
			me._ht_video_url_bg.visible=false;
			player.repaint();
			me._ht_video_url_bg.userData.visible=false;
				}
			}
		}
		me._ht_video_url_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
		me._ht_video_url_bg.userData.onclick=function (e) {
			player.setVariableValue('open_video_hs', player.getVariableValue('open_video_hs') + "<"+me.hotspot.id+">");
			me._ht_video_url_popup.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_url_bg.userData.hasOwnClickAction = true;
		me._ht_video_url_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_video_url_bg']=true;
			me._ht_video_url_title.logicBlock_alpha();
			me._ht_video_url_title_gs.logicBlock_alpha();
			me._ht_video_url_bg.logicBlock_scaling();
		}
		me._ht_video_url_bg.userData.ontouchend=function (e) {
			me._ht_video_url_bg.logicBlock_scaling();
		}
		me._ht_video_url_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_url_bg']=false;
			me._ht_video_url_title.logicBlock_alpha();
			me._ht_video_url_title_gs.logicBlock_alpha();
			me._ht_video_url_bg.logicBlock_scaling();
		}
		me._ht_video_url_bg.userData.ggUpdatePosition=function (useTransition) {
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
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 36;
		el.userData.height = 36;
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
		clickTargetGeometry = new THREE.PlaneGeometry(36 / 100.0, 36 / 100.0, 5, 5 );
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
		me._ht_video_url_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url_bg.add(me._ht_video_url_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_url_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_title';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_title.visible
			let parentEl = me._ht_video_url_title.parent;
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
			me._ht_video_url_title.userData.opacity = v;
			v = v * me._ht_video_url_title.userData.parentOpacity;
			if (me._ht_video_url_title.userData.setOpacityInternal) me._ht_video_url_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_title.children.length; i++) {
				let child = me._ht_video_url_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_title.userData.parentOpacity = v;
			v = v * me._ht_video_url_title.userData.opacity
			if (me._ht_video_url_title.userData.setOpacityInternal) me._ht_video_url_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_title.children.length; i++) {
				let child = me._ht_video_url_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_title = el;
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
			let el = me._ht_video_url_title;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_url_title);
			if (skin.rectHasRoundedCorners(me._ht_video_url_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_url_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_url_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_url_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_url_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_video_url_title_geometry';
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
				geometry.name = 'ht_video_url_title_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_url_title.userData.backgroundColorAlpha = 1;
		me._ht_video_url_title.userData.borderColorAlpha = 1;
		me._ht_video_url_title.userData.setOpacityInternal = function(v) {
			me._ht_video_url_title.material.opacity = v;
			if (me._ht_video_url_title.userData.hasScrollbar) {
				me._ht_video_url_title.userData.scrollbar.material.opacity = v;
				me._ht_video_url_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_url_title.userData.ggSubElement) {
				me._ht_video_url_title.userData.ggSubElement.material.opacity = v
				me._ht_video_url_title.userData.ggSubElement.visible = (v>0 && me._ht_video_url_title.userData.visible);
			}
			me._ht_video_url_title.visible = (v>0 && me._ht_video_url_title.userData.visible);
		}
		me._ht_video_url_title.userData.setBackgroundColor = function(v) {
			me._ht_video_url_title.material.color = v;
		}
		me._ht_video_url_title.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_title.userData.backgroundColorAlpha = v;
			me._ht_video_url_title.userData.setOpacity(me._ht_video_url_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_video_url_title;
			var canv = me._ht_video_url_title.userData.textCanvas;
			var ctx = me._ht_video_url_title.userData.textCanvasContext;
			var tmpCanv = me._ht_video_url_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_video_url_title.userData.scrollPosPercent ? tmpCanv.height * me._ht_video_url_title.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_video_url_title.userData.boxWidthCanv / 100.0;
		height = me._ht_video_url_title.userData.boxHeightCanv / 100.0;
		me._ht_video_url_title.userData.width = me._ht_video_url_title.userData.boxWidthCanv;
		me._ht_video_url_title.userData.height = me._ht_video_url_title.userData.boxHeightCanv;
		me._ht_video_url_title.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_video_url_title, 0, -20);
		me._ht_video_url_title.position.x = newPos.x;
		me._ht_video_url_title.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_url_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_url_title.material.map) {
				me._ht_video_url_title.material.map.dispose();
			}
			me._ht_video_url_title.material.map = textTexture;
			me._ht_video_url_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_video_url_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_video_url_title, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me._ht_video_url_title.userData.textColor + ' !important;', false, true, false);
			me._ht_video_url_title.userData.hasScrollbar = false;
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
			me._ht_video_url_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_url_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_url_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_url_title";
		me._ht_video_url_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_title.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_title.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_title.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_title.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_title.visible=false;
			player.repaint();
			me._ht_video_url_title.userData.visible=false;
				}
				else {
			me._ht_video_url_title.visible=((!me._ht_video_url_title.material && Number(me._ht_video_url_title.userData.opacity>0)) || (me._ht_video_url_title.material && Number(me._ht_video_url_title.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_title.userData.visible=true;
				}
			}
		}
		me._ht_video_url_title.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_video_url_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_title.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_title.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_title.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_title.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_title.userData.transitions.length; i++) {
						if (me._ht_video_url_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_title.userData.transitions[i].interval);
							me._ht_video_url_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_title.material ? me._ht_video_url_title.material.opacity : me._ht_video_url_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_title.userData.transitions.splice(me._ht_video_url_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_title.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_url_title.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_title.userData.transitions.length; i++) {
						if (me._ht_video_url_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_title.userData.transitions[i].interval);
							me._ht_video_url_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_title.material ? me._ht_video_url_title.material.opacity : me._ht_video_url_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_title.userData.transitions.splice(me._ht_video_url_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_title.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_url_title.userData.ggUpdatePosition=function (useTransition) {
				me._ht_video_url_title.userData.ggUpdateText(true);
		}
		me._ht_video_url_bg.add(me._ht_video_url_title);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_url_title_gs_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_title_gs';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_title_gs.visible
			let parentEl = me._ht_video_url_title_gs.parent;
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
			me._ht_video_url_title_gs.userData.opacity = v;
			v = v * me._ht_video_url_title_gs.userData.parentOpacity;
			if (me._ht_video_url_title_gs.userData.setOpacityInternal) me._ht_video_url_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_title_gs.children.length; i++) {
				let child = me._ht_video_url_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_title_gs.userData.parentOpacity = v;
			v = v * me._ht_video_url_title_gs.userData.opacity
			if (me._ht_video_url_title_gs.userData.setOpacityInternal) me._ht_video_url_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_title_gs.children.length; i++) {
				let child = me._ht_video_url_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_url_title_gs = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 6;
		el.userData.borderRadius.default.topRight = 6;
		el.userData.borderRadius.default.bottomRight = 6;
		el.userData.borderRadius.default.bottomLeft = 6;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_url_title_gs;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_url_title_gs);
			if (skin.rectHasRoundedCorners(me._ht_video_url_title_gs)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_url_title_gs.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_url_title_gs.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_url_title_gs.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_url_title_gs.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_video_url_title_gs_geometry';
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
				geometry.name = 'ht_video_url_title_gs_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_url_title_gs.userData.backgroundColorAlpha = 1;
		me._ht_video_url_title_gs.userData.borderColorAlpha = 1;
		me._ht_video_url_title_gs.userData.setOpacityInternal = function(v) {
			me._ht_video_url_title_gs.material.opacity = v;
			if (me._ht_video_url_title_gs.userData.hasScrollbar) {
				me._ht_video_url_title_gs.userData.scrollbar.material.opacity = v;
				me._ht_video_url_title_gs.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_url_title_gs.userData.ggSubElement) {
				me._ht_video_url_title_gs.userData.ggSubElement.material.opacity = v
				me._ht_video_url_title_gs.userData.ggSubElement.visible = (v>0 && me._ht_video_url_title_gs.userData.visible);
			}
			me._ht_video_url_title_gs.visible = (v>0 && me._ht_video_url_title_gs.userData.visible);
		}
		me._ht_video_url_title_gs.userData.setBackgroundColor = function(v) {
			me._ht_video_url_title_gs.material.color = v;
		}
		me._ht_video_url_title_gs.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_title_gs.userData.backgroundColorAlpha = v;
			me._ht_video_url_title_gs.userData.setOpacity(me._ht_video_url_title_gs.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 6, 6, 6, 6);
		el.userData.backgroundColor = player.getTHREESkinColor('#4a4a4a');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_video_url_title_gs;
			var canv = me._ht_video_url_title_gs.userData.textCanvas;
			var ctx = me._ht_video_url_title_gs.userData.textCanvasContext;
			var tmpCanv = me._ht_video_url_title_gs.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_url_title_gs.userData.backgroundColor.r * 255 + ', ' + me._ht_video_url_title_gs.userData.backgroundColor.g * 255 + ', ' + me._ht_video_url_title_gs.userData.backgroundColor.b * 255 + ', ' + me._ht_video_url_title_gs.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_video_url_title_gs.userData.scrollPosPercent ? tmpCanv.height * me._ht_video_url_title_gs.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_video_url_title_gs.userData.boxWidthCanv / 100.0;
		height = me._ht_video_url_title_gs.userData.boxHeightCanv / 100.0;
		me._ht_video_url_title_gs.userData.width = me._ht_video_url_title_gs.userData.boxWidthCanv;
		me._ht_video_url_title_gs.userData.height = me._ht_video_url_title_gs.userData.boxHeightCanv;
		me._ht_video_url_title_gs.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_video_url_title_gs, 0, -20);
		me._ht_video_url_title_gs.position.x = newPos.x;
		me._ht_video_url_title_gs.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_url_title_gs_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_url_title_gs.material.map) {
				me._ht_video_url_title_gs.material.map.dispose();
			}
			me._ht_video_url_title_gs.material.map = textTexture;
			me._ht_video_url_title_gs.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_video_url_title_gs, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_video_url_title_gs, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 1px; overflow: hidden;' + '; color: ' + me._ht_video_url_title_gs.userData.textColor + ' !important;', false, true, false);
			me._ht_video_url_title_gs.userData.hasScrollbar = false;
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
			me._ht_video_url_title_gs.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_title_gs.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_url_title_gs.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_url_title_gs.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_url_title_gs";
		me._ht_video_url_title_gs.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_title_gs.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_title_gs.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_title_gs.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_title_gs.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_title_gs.visible=((!me._ht_video_url_title_gs.material && Number(me._ht_video_url_title_gs.userData.opacity>0)) || (me._ht_video_url_title_gs.material && Number(me._ht_video_url_title_gs.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_title_gs.userData.visible=true;
				}
				else {
			me._ht_video_url_title_gs.visible=false;
			player.repaint();
			me._ht_video_url_title_gs.userData.visible=false;
				}
			}
		}
		me._ht_video_url_title_gs.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_video_url_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_title_gs.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_title_gs.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_title_gs.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_title_gs.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_title_gs.userData.transitions.length; i++) {
						if (me._ht_video_url_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_title_gs.userData.transitions[i].interval);
							me._ht_video_url_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_title_gs.material ? me._ht_video_url_title_gs.material.opacity : me._ht_video_url_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_title_gs.userData.transitions.splice(me._ht_video_url_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_title_gs.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_url_title_gs.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_title_gs.userData.transitions.length; i++) {
						if (me._ht_video_url_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_title_gs.userData.transitions[i].interval);
							me._ht_video_url_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_title_gs.material ? me._ht_video_url_title_gs.material.opacity : me._ht_video_url_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_title_gs.userData.transitions.splice(me._ht_video_url_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_title_gs.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_url_title_gs.userData.ggUpdatePosition=function (useTransition) {
				me._ht_video_url_title_gs.userData.ggUpdateText(true);
		}
		me._ht_video_url_bg.add(me._ht_video_url_title_gs);
		me._ht_video_url.add(me._ht_video_url_bg);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_url_popup_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(0.10, 0.10, 1.0);
		el.userData.width = 660;
		el.userData.height = 480;
		el.userData.scale = {x: 0.10, y: 0.10, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_popup_bg';
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
			let vis = me._ht_video_url_popup_bg.visible
			let parentEl = me._ht_video_url_popup_bg.parent;
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
			me._ht_video_url_popup_bg.userData.opacity = v;
			v = v * me._ht_video_url_popup_bg.userData.parentOpacity;
			if (me._ht_video_url_popup_bg.userData.setOpacityInternal) me._ht_video_url_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_popup_bg.children.length; i++) {
				let child = me._ht_video_url_popup_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_popup_bg.userData.parentOpacity = v;
			v = v * me._ht_video_url_popup_bg.userData.opacity
			if (me._ht_video_url_popup_bg.userData.setOpacityInternal) me._ht_video_url_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_popup_bg.children.length; i++) {
				let child = me._ht_video_url_popup_bg.children[i];
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
		me._ht_video_url_popup_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 30;
		el.userData.borderRadius.default.topRight = 30;
		el.userData.borderRadius.default.bottomRight = 30;
		el.userData.borderRadius.default.bottomLeft = 30;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_url_popup_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_url_popup_bg);
			if (skin.rectHasRoundedCorners(me._ht_video_url_popup_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_url_popup_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_url_popup_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_url_popup_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_url_popup_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_video_url_popup_bg_geometry';
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
				geometry.name = 'ht_video_url_popup_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_url_popup_bg.userData.backgroundColorAlpha = 0.666667;
		me._ht_video_url_popup_bg.userData.borderColorAlpha = 1;
		me._ht_video_url_popup_bg.userData.setOpacityInternal = function(v) {
			me._ht_video_url_popup_bg.material.opacity = v * me._ht_video_url_popup_bg.userData.backgroundColorAlpha;
			if (me._ht_video_url_popup_bg.userData.ggSubElement) {
				me._ht_video_url_popup_bg.userData.ggSubElement.material.opacity = v
				me._ht_video_url_popup_bg.userData.ggSubElement.visible = (v>0 && me._ht_video_url_popup_bg.userData.visible);
			}
			me._ht_video_url_popup_bg.visible = (v>0 && me._ht_video_url_popup_bg.userData.visible);
		}
		me._ht_video_url_popup_bg.userData.setBackgroundColor = function(v) {
			me._ht_video_url_popup_bg.material.color = v;
		}
		me._ht_video_url_popup_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_url_popup_bg.userData.backgroundColorAlpha = v;
			me._ht_video_url_popup_bg.userData.setOpacity(me._ht_video_url_popup_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 30, 30, 30, 30);
		el.userData.ggId="ht_video_url_popup_bg";
		me._ht_video_url_popup_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_popup_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_url_popup_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_url_popup_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_url_popup_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_video_url_popup_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_popup_bg.userData.transitions[i].interval);
							me._ht_video_url_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_video_url_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_popup_bg.position.x = (me._ht_video_url_popup_bg.position.x - me._ht_video_url_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_popup_bg.position.y = (me._ht_video_url_popup_bg.position.y - me._ht_video_url_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_popup_bg.userData.transitions.splice(me._ht_video_url_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_popup_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_url_popup_bg.userData.transitionValue_scale = {x: 0.1, y: 0.1, z: 1.0};
					for (var i = 0; i < me._ht_video_url_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_url_popup_bg.userData.transitions[i].interval);
							me._ht_video_url_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_url_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_video_url_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_url_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_url_popup_bg.position.x = (me._ht_video_url_popup_bg.position.x - me._ht_video_url_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_url_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_url_popup_bg.position.y = (me._ht_video_url_popup_bg.position.y - me._ht_video_url_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_url_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_url_popup_bg.userData.transitions.splice(me._ht_video_url_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_url_popup_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_url_popup_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_url_popup_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_url_popup_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_url_popup_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_url_popup_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_url_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_popup_bg.userData.transitions[i].interval);
							me._ht_video_url_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_popup_bg.material ? me._ht_video_url_popup_bg.material.opacity : me._ht_video_url_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_popup_bg.userData.transitions.splice(me._ht_video_url_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_url_popup_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_url_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_url_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_url_popup_bg.userData.transitions[i].interval);
							me._ht_video_url_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_url_popup_bg.material ? me._ht_video_url_popup_bg.material.opacity : me._ht_video_url_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_url_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_url_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_url_popup_bg.userData.transitions.splice(me._ht_video_url_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_url_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_url_popup_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneGeometry(6, 3.8, 5, 5 );
		geometry.name = 'ht_video_url_popup_geometry';
		material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_url_popup_material';
		el = new THREE.Mesh( geometry, material );
		el.translateX(0);
		el.translateY(-0.1);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 600;
		el.userData.height = 380;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_popup';
		el.userData.x = 0;
		el.userData.y = -0.1;
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
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_url_popup.material) me._ht_video_url_popup.material.opacity = v;
			me._ht_video_url_popup.visible = (v>0 && me._ht_video_url_popup.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_url_popup.visible
			let parentEl = me._ht_video_url_popup.parent;
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
			me._ht_video_url_popup.userData.opacity = v;
			v = v * me._ht_video_url_popup.userData.parentOpacity;
			if (me._ht_video_url_popup.userData.setOpacityInternal) me._ht_video_url_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_popup.children.length; i++) {
				let child = me._ht_video_url_popup.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_popup.userData.parentOpacity = v;
			v = v * me._ht_video_url_popup.userData.opacity
			if (me._ht_video_url_popup.userData.setOpacityInternal) me._ht_video_url_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_popup.children.length; i++) {
				let child = me._ht_video_url_popup.children[i];
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
		me._ht_video_url_popup = el;
		me._ht_video_url_popup.userData.seekbars = [];
		me._ht_video_url_popup.userData.ggInitMedia = function(media) {
			if (me._ht_video_url_popup__vid) me._ht_video_url_popup__vid.pause();
			me._ht_video_url_popup__vid = document.createElement('video');
			player.registerVideoElement('ht_video_url_popup', me._ht_video_url_popup__vid);
			me._ht_video_url_popup__vid.setAttribute('autoplay', '');
			me._ht_video_url_popup__vid.setAttribute('crossOrigin', 'anonymous');
			me._ht_video_url_popup__source = document.createElement('source');
			me._ht_video_url_popup__source.setAttribute('src', media);
			me._ht_video_url_popup__vid.addEventListener('loadedmetadata', function() {
				let videoAR = me._ht_video_url_popup__vid.videoWidth / me._ht_video_url_popup__vid.videoHeight;
				let elAR = me._ht_video_url_popup.userData.width / me._ht_video_url_popup.userData.height;
				if (videoAR > elAR) {
					me._ht_video_url_popup.scale.set(1, (me._ht_video_url_popup.userData.width / videoAR) / me._ht_video_url_popup.userData.height, 1);
				} else {
					me._ht_video_url_popup.scale.set((me._ht_video_url_popup.userData.height * videoAR) / me._ht_video_url_popup.userData.width, 1, 1);
				}
			}, false);
			me._ht_video_url_popup__vid.appendChild(me._ht_video_url_popup__source);
			videoTexture = new THREE.VideoTexture( me._ht_video_url_popup__vid );
			videoTexture.name = 'ht_video_url_popup_videoTexture';
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, transparent: true} );
			videoMaterial.name = 'ht_video_url_popup_videoMaterial';
			videoMaterial.alphaTest = 0.5;
			me._ht_video_url_popup.material = videoMaterial;
		}
		el.userData.ggId="ht_video_url_popup";
		me._ht_video_url_popup.userData.ggIsActive=function() {
			if (me._ht_video_url_popup__vid != null) {
				return (me._ht_video_url_popup__vid.paused == false && me._ht_video_url_popup__vid.ended == false);
			} else {
				return false;
			}
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_popup.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_url_popup.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_url_popup.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_url_popup.ggCurrentLogicStateVisible == 0) {
			me._ht_video_url_popup.visible=((!me._ht_video_url_popup.material && Number(me._ht_video_url_popup.userData.opacity>0)) || (me._ht_video_url_popup.material && Number(me._ht_video_url_popup.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_popup.userData.visible=true;
					if (me._ht_video_url_popup.userData.ggVideoNotLoaded) {
						me._ht_video_url_popup.userData.ggInitMedia(me._ht_video_url_popup.ggVideoSource);
					}
				}
				else {
			me._ht_video_url_popup.visible=false;
			player.repaint();
			me._ht_video_url_popup.userData.visible=false;
					me._ht_video_url_popup.userData.ggInitMedia('');
				}
			}
		}
		me._ht_video_url_popup.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url_popup_bg.add(me._ht_video_url_popup);
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
			if (me._ht_video_url_popup_close.userData.svgGroupNormal) me._ht_video_url_popup_close.userData.setOpacityInState(me._ht_video_url_popup_close.userData.svgGroupNormal, v);
			if (me._ht_video_url_popup_close.userData.svgGroupOver) me._ht_video_url_popup_close.userData.setOpacityInState(me._ht_video_url_popup_close.userData.svgGroupOver, v);
			if (me._ht_video_url_popup_close.userData.svgGroupActive) me._ht_video_url_popup_close.userData.setOpacityInState(me._ht_video_url_popup_close.userData.svgGroupActive, v);
			me._ht_video_url_popup_close.visible = (v>0 && me._ht_video_url_popup_close.userData.visible);
		}
		el.translateX(2.85);
		el.translateY(2.05);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 40;
		el.userData.height = 40;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_url_popup_close';
		el.userData.x = 2.85;
		el.userData.y = 2.05;
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
			let vis = me._ht_video_url_popup_close.visible
			let parentEl = me._ht_video_url_popup_close.parent;
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
			me._ht_video_url_popup_close.userData.opacity = v;
			v = v * me._ht_video_url_popup_close.userData.parentOpacity;
			if (me._ht_video_url_popup_close.userData.setOpacityInternal) me._ht_video_url_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_popup_close.children.length; i++) {
				let child = me._ht_video_url_popup_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_url_popup_close.userData.parentOpacity = v;
			v = v * me._ht_video_url_popup_close.userData.opacity
			if (me._ht_video_url_popup_close.userData.setOpacityInternal) me._ht_video_url_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_url_popup_close.children.length; i++) {
				let child = me._ht_video_url_popup_close.children[i];
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
		me._ht_video_url_popup_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(40 / 100.0, 40 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_video_url_popup_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_video_url_popup_close_clickTargetMaterial';
		me._ht_video_url_popup_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_video_url_popup_close.userData.clickTarget.name = 'ht_video_url_popup_close_clickTarget';
		me._ht_video_url_popup_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_video_url_popup_close.userData.clickTarget.visible = false;
		me._ht_video_url_popup_close.add(me._ht_video_url_popup_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_video_url_popup_close.svg', me._ht_video_url_popup_close.userData.width / 100.0, me._ht_video_url_popup_close.userData.height / 100.0);
			me._ht_video_url_popup_close.add(group);
			me._ht_video_url_popup_close.userData.svgGroupNormal = group;
			me._ht_video_url_popup_close.userData.setOpacityInState(group, me._ht_video_url_popup_close.userData.opacity);
			player.repaint(3);
		})();
		(async() => {
			group = await player.loadSvg3D(basePath + 'images_vr/ht_video_url_popup_close__o.svg', me._ht_video_url_popup_close.userData.width / 100.0, me._ht_video_url_popup_close.userData.height / 100.0);
			group.visible = false;
			me._ht_video_url_popup_close.add(group);
			me._ht_video_url_popup_close.userData.svgGroupOver = group;
			me._ht_video_url_popup_close.userData.setOpacityInState(group, me._ht_video_url_popup_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_video_url_popup_close";
		me._ht_video_url_popup_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_url_popup_close.userData.onclick=function (e) {
			player.setVariableValue('open_video_hs', player.getVariableValue('open_video_hs').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_video_url_popup_close.userData.hasOwnClickAction = true;
		me._ht_video_url_popup_close.userData.onmouseenter=function (e) {
			me._ht_video_url_popup_close.userData.svgGroupNormal.visible = false;
			me._ht_video_url_popup_close.userData.svgGroupOver.visible = true;
			me.elementMouseOver['ht_video_url_popup_close']=true;
		}
		me._ht_video_url_popup_close.userData.onmouseleave=function (e) {
			me._ht_video_url_popup_close.userData.svgGroupNormal.visible = true;
			me._ht_video_url_popup_close.userData.svgGroupOver.visible = false;
			if (me._ht_video_url_popup_close.userData.svgGroupActive) me._ht_video_url_popup_close.userData.svgGroupActive.visible = false;
			me.elementMouseOver['ht_video_url_popup_close']=false;
		}
		me._ht_video_url_popup_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_url_popup_bg.add(me._ht_video_url_popup_close);
		me._ht_video_url.add(me._ht_video_url_popup_bg);
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
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
				((me.hotspot.customimage == "")) || 
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
			me._ht_video_url_customimage.visible=false;
			player.repaint();
			me._ht_video_url_customimage.userData.visible=false;
				}
				else {
			me._ht_video_url_customimage.visible=((!me._ht_video_url_customimage.material && Number(me._ht_video_url_customimage.userData.opacity>0)) || (me._ht_video_url_customimage.material && Number(me._ht_video_url_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_url_customimage.userData.visible=true;
				}
			}
		}
		me._ht_video_url_customimage.userData.onclick=function (e) {
			player.setVariableValue('open_video_hs', player.getVariableValue('open_video_hs') + "<"+me.hotspot.id+">");
			me._ht_video_url_popup.userData.ggInitMedia(player._(me.hotspot.url));
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
		me._ht_video_url_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_bg.traverse((obj)=>{
				if (me._ht_video_url_bg.material) {
					me._ht_video_url_bg.material.transparent = (me._ht_video_url_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_url_bg']=false;
		me._ht_video_url_bg.logicBlock_scaling();
		me._ht_video_url_bg.logicBlock_visible();
		me._ht_video_url_bg.logicBlock_alpha();
		me._ht_video_url_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_icon.traverse((obj)=>{
				if (me._ht_video_url_icon.material) {
					me._ht_video_url_icon.material.transparent = (me._ht_video_url_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_url_title.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_title.traverse((obj)=>{
				if (me._ht_video_url_title.material) {
					me._ht_video_url_title.material.transparent = (me._ht_video_url_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_video_url_title.userData.ggUpdateText(true);
		me._ht_video_url_title.logicBlock_visible();
		me._ht_video_url_title.logicBlock_alpha();
		me._ht_video_url_title_gs.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_title_gs.traverse((obj)=>{
				if (me._ht_video_url_title_gs.material) {
					me._ht_video_url_title_gs.material.transparent = (me._ht_video_url_title_gs.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_video_url_title_gs.userData.ggUpdateText(true);
		me._ht_video_url_title_gs.logicBlock_visible();
		me._ht_video_url_title_gs.logicBlock_alpha();
		me._ht_video_url_popup_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_popup_bg.traverse((obj)=>{
				if (me._ht_video_url_popup_bg.material) {
					me._ht_video_url_popup_bg.material.transparent = (me._ht_video_url_popup_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_url_popup_bg.logicBlock_scaling();
		me._ht_video_url_popup_bg.logicBlock_alpha();
		me._ht_video_url_popup.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_popup.traverse((obj)=>{
				if (me._ht_video_url_popup.material) {
					me._ht_video_url_popup.material.transparent = (me._ht_video_url_popup.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_url_popup.userData.ggVideoSource = '';
		me._ht_video_url_popup.userData.ggVideoNotLoaded = true;
		me._ht_video_url_popup.logicBlock_visible();
		me._ht_video_url_popup_close.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_url_popup_close.traverse((obj)=>{
				if (me._ht_video_url_popup_close.material) {
					me._ht_video_url_popup_close.material.transparent = (me._ht_video_url_popup_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_url_popup_close']=false;
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
				me._ht_video_url_bg.logicBlock_visible();
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
					me._ht_video_url_bg.traverse((obj)=>{
						if (me._ht_video_url_bg.material) {
							me._ht_video_url_bg.material.transparent = (me._ht_video_url_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_bg.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_icon.traverse((obj)=>{
						if (me._ht_video_url_icon.material) {
							me._ht_video_url_icon.material.transparent = (me._ht_video_url_icon.userData.zIndexCurrent > 0);
							}
					});
				}
					me._ht_video_url_title.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_title.traverse((obj)=>{
						if (me._ht_video_url_title.material) {
							me._ht_video_url_title.material.transparent = (me._ht_video_url_title.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_title.logicBlock_visible();
					me._ht_video_url_title_gs.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_title_gs.traverse((obj)=>{
						if (me._ht_video_url_title_gs.material) {
							me._ht_video_url_title_gs.material.transparent = (me._ht_video_url_title_gs.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_title_gs.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_popup_bg.traverse((obj)=>{
						if (me._ht_video_url_popup_bg.material) {
							me._ht_video_url_popup_bg.material.transparent = (me._ht_video_url_popup_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_popup_bg.logicBlock_scaling();
				me._ht_video_url_popup_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_popup.traverse((obj)=>{
						if (me._ht_video_url_popup.material) {
							me._ht_video_url_popup.material.transparent = (me._ht_video_url_popup.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_url_popup.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_url_popup_close.traverse((obj)=>{
						if (me._ht_video_url_popup_close.material) {
							me._ht_video_url_popup_close.material.transparent = (me._ht_video_url_popup_close.userData.zIndexCurrent > 0);
							}
					});
				}
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
				me._ht_video_url_bg.logicBlock_visible();
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_popup_bg.logicBlock_scaling();
				me._ht_video_url_popup_bg.logicBlock_alpha();
				me._ht_video_url_popup.logicBlock_visible();
				me._ht_video_url_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_open_video_hs=function() {
				me._ht_video_url_bg.logicBlock_alpha();
				me._ht_video_url_popup_bg.logicBlock_scaling();
				me._ht_video_url_popup_bg.logicBlock_alpha();
				me._ht_video_url_popup.logicBlock_visible();
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
		el.userData.x = 2.72;
		el.userData.y = 2.08;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_file_bg_material';
			el.material = material;
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
		el.name = 'ht_video_file_bg';
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
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
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
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
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
		me._ht_video_file_bg.userData.backgroundColorAlpha = 0.588235;
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
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
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
				((me.elementMouseOver['ht_video_file_bg'] == true))
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
					me._ht_video_file_bg.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
		me._ht_video_file_bg.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage == ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_bg.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_bg.visible=((!me._ht_video_file_bg.material && Number(me._ht_video_file_bg.userData.opacity>0)) || (me._ht_video_file_bg.material && Number(me._ht_video_file_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_bg.userData.visible=true;
				}
				else {
			me._ht_video_file_bg.visible=false;
			player.repaint();
			me._ht_video_file_bg.userData.visible=false;
				}
			}
		}
		me._ht_video_file_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
		me._ht_video_file_bg.userData.onclick=function (e) {
			player.setVariableValue('open_video_hs', player.getVariableValue('open_video_hs') + "<"+me.hotspot.id+">");
			me._ht_video_file_popup.userData.ggInitMedia(player._(me.hotspot.url));
		}
		me._ht_video_file_bg.userData.hasOwnClickAction = true;
		me._ht_video_file_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_video_file_bg']=true;
			me._ht_video_file_title.logicBlock_alpha();
			me._ht_video_file_title_gs.logicBlock_alpha();
			me._ht_video_file_bg.logicBlock_scaling();
		}
		me._ht_video_file_bg.userData.ontouchend=function (e) {
			me._ht_video_file_bg.logicBlock_scaling();
		}
		me._ht_video_file_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_video_file_bg']=false;
			me._ht_video_file_title.logicBlock_alpha();
			me._ht_video_file_title_gs.logicBlock_alpha();
			me._ht_video_file_bg.logicBlock_scaling();
		}
		me._ht_video_file_bg.userData.ggUpdatePosition=function (useTransition) {
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
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 36;
		el.userData.height = 36;
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
		clickTargetGeometry = new THREE.PlaneGeometry(36 / 100.0, 36 / 100.0, 5, 5 );
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
		me._ht_video_file_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file_bg.add(me._ht_video_file_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_file_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_title';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_title.visible
			let parentEl = me._ht_video_file_title.parent;
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
			me._ht_video_file_title.userData.opacity = v;
			v = v * me._ht_video_file_title.userData.parentOpacity;
			if (me._ht_video_file_title.userData.setOpacityInternal) me._ht_video_file_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_title.children.length; i++) {
				let child = me._ht_video_file_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_title.userData.parentOpacity = v;
			v = v * me._ht_video_file_title.userData.opacity
			if (me._ht_video_file_title.userData.setOpacityInternal) me._ht_video_file_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_title.children.length; i++) {
				let child = me._ht_video_file_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_title = el;
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
			let el = me._ht_video_file_title;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_file_title);
			if (skin.rectHasRoundedCorners(me._ht_video_file_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_file_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_file_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_file_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_file_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_video_file_title_geometry';
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
				geometry.name = 'ht_video_file_title_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_file_title.userData.backgroundColorAlpha = 1;
		me._ht_video_file_title.userData.borderColorAlpha = 1;
		me._ht_video_file_title.userData.setOpacityInternal = function(v) {
			me._ht_video_file_title.material.opacity = v;
			if (me._ht_video_file_title.userData.hasScrollbar) {
				me._ht_video_file_title.userData.scrollbar.material.opacity = v;
				me._ht_video_file_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_file_title.userData.ggSubElement) {
				me._ht_video_file_title.userData.ggSubElement.material.opacity = v
				me._ht_video_file_title.userData.ggSubElement.visible = (v>0 && me._ht_video_file_title.userData.visible);
			}
			me._ht_video_file_title.visible = (v>0 && me._ht_video_file_title.userData.visible);
		}
		me._ht_video_file_title.userData.setBackgroundColor = function(v) {
			me._ht_video_file_title.material.color = v;
		}
		me._ht_video_file_title.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_title.userData.backgroundColorAlpha = v;
			me._ht_video_file_title.userData.setOpacity(me._ht_video_file_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_video_file_title;
			var canv = me._ht_video_file_title.userData.textCanvas;
			var ctx = me._ht_video_file_title.userData.textCanvasContext;
			var tmpCanv = me._ht_video_file_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_video_file_title.userData.scrollPosPercent ? tmpCanv.height * me._ht_video_file_title.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_video_file_title.userData.boxWidthCanv / 100.0;
		height = me._ht_video_file_title.userData.boxHeightCanv / 100.0;
		me._ht_video_file_title.userData.width = me._ht_video_file_title.userData.boxWidthCanv;
		me._ht_video_file_title.userData.height = me._ht_video_file_title.userData.boxHeightCanv;
		me._ht_video_file_title.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_video_file_title, 0, -20);
		me._ht_video_file_title.position.x = newPos.x;
		me._ht_video_file_title.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_file_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_file_title.material.map) {
				me._ht_video_file_title.material.map.dispose();
			}
			me._ht_video_file_title.material.map = textTexture;
			me._ht_video_file_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_video_file_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_video_file_title, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me._ht_video_file_title.userData.textColor + ' !important;', false, true, false);
			me._ht_video_file_title.userData.hasScrollbar = false;
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
			me._ht_video_file_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_file_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_file_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_file_title";
		me._ht_video_file_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_title.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_title.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_title.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_title.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_title.visible=false;
			player.repaint();
			me._ht_video_file_title.userData.visible=false;
				}
				else {
			me._ht_video_file_title.visible=((!me._ht_video_file_title.material && Number(me._ht_video_file_title.userData.opacity>0)) || (me._ht_video_file_title.material && Number(me._ht_video_file_title.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_title.userData.visible=true;
				}
			}
		}
		me._ht_video_file_title.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_video_file_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_title.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_title.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_title.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_title.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_title.userData.transitions.length; i++) {
						if (me._ht_video_file_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_title.userData.transitions[i].interval);
							me._ht_video_file_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_title.material ? me._ht_video_file_title.material.opacity : me._ht_video_file_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_title.userData.transitions.splice(me._ht_video_file_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_title.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_file_title.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_title.userData.transitions.length; i++) {
						if (me._ht_video_file_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_title.userData.transitions[i].interval);
							me._ht_video_file_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_title.material ? me._ht_video_file_title.material.opacity : me._ht_video_file_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_title.userData.transitions.splice(me._ht_video_file_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_title.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_file_title.userData.ggUpdatePosition=function (useTransition) {
				me._ht_video_file_title.userData.ggUpdateText(true);
		}
		me._ht_video_file_bg.add(me._ht_video_file_title);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_file_title_gs_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_title_gs';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_title_gs.visible
			let parentEl = me._ht_video_file_title_gs.parent;
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
			me._ht_video_file_title_gs.userData.opacity = v;
			v = v * me._ht_video_file_title_gs.userData.parentOpacity;
			if (me._ht_video_file_title_gs.userData.setOpacityInternal) me._ht_video_file_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_title_gs.children.length; i++) {
				let child = me._ht_video_file_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_title_gs.userData.parentOpacity = v;
			v = v * me._ht_video_file_title_gs.userData.opacity
			if (me._ht_video_file_title_gs.userData.setOpacityInternal) me._ht_video_file_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_title_gs.children.length; i++) {
				let child = me._ht_video_file_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_video_file_title_gs = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 6;
		el.userData.borderRadius.default.topRight = 6;
		el.userData.borderRadius.default.bottomRight = 6;
		el.userData.borderRadius.default.bottomLeft = 6;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_file_title_gs;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_file_title_gs);
			if (skin.rectHasRoundedCorners(me._ht_video_file_title_gs)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_file_title_gs.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_file_title_gs.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_file_title_gs.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_file_title_gs.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_video_file_title_gs_geometry';
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
				geometry.name = 'ht_video_file_title_gs_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_file_title_gs.userData.backgroundColorAlpha = 1;
		me._ht_video_file_title_gs.userData.borderColorAlpha = 1;
		me._ht_video_file_title_gs.userData.setOpacityInternal = function(v) {
			me._ht_video_file_title_gs.material.opacity = v;
			if (me._ht_video_file_title_gs.userData.hasScrollbar) {
				me._ht_video_file_title_gs.userData.scrollbar.material.opacity = v;
				me._ht_video_file_title_gs.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_video_file_title_gs.userData.ggSubElement) {
				me._ht_video_file_title_gs.userData.ggSubElement.material.opacity = v
				me._ht_video_file_title_gs.userData.ggSubElement.visible = (v>0 && me._ht_video_file_title_gs.userData.visible);
			}
			me._ht_video_file_title_gs.visible = (v>0 && me._ht_video_file_title_gs.userData.visible);
		}
		me._ht_video_file_title_gs.userData.setBackgroundColor = function(v) {
			me._ht_video_file_title_gs.material.color = v;
		}
		me._ht_video_file_title_gs.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_title_gs.userData.backgroundColorAlpha = v;
			me._ht_video_file_title_gs.userData.setOpacity(me._ht_video_file_title_gs.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 6, 6, 6, 6);
		el.userData.backgroundColor = player.getTHREESkinColor('#4a4a4a');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_video_file_title_gs;
			var canv = me._ht_video_file_title_gs.userData.textCanvas;
			var ctx = me._ht_video_file_title_gs.userData.textCanvasContext;
			var tmpCanv = me._ht_video_file_title_gs.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_video_file_title_gs.userData.backgroundColor.r * 255 + ', ' + me._ht_video_file_title_gs.userData.backgroundColor.g * 255 + ', ' + me._ht_video_file_title_gs.userData.backgroundColor.b * 255 + ', ' + me._ht_video_file_title_gs.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_video_file_title_gs.userData.scrollPosPercent ? tmpCanv.height * me._ht_video_file_title_gs.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_video_file_title_gs.userData.boxWidthCanv / 100.0;
		height = me._ht_video_file_title_gs.userData.boxHeightCanv / 100.0;
		me._ht_video_file_title_gs.userData.width = me._ht_video_file_title_gs.userData.boxWidthCanv;
		me._ht_video_file_title_gs.userData.height = me._ht_video_file_title_gs.userData.boxHeightCanv;
		me._ht_video_file_title_gs.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_video_file_title_gs, 0, -20);
		me._ht_video_file_title_gs.position.x = newPos.x;
		me._ht_video_file_title_gs.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_video_file_title_gs_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_video_file_title_gs.material.map) {
				me._ht_video_file_title_gs.material.map.dispose();
			}
			me._ht_video_file_title_gs.material.map = textTexture;
			me._ht_video_file_title_gs.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_video_file_title_gs, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_video_file_title_gs, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 1px; overflow: hidden;' + '; color: ' + me._ht_video_file_title_gs.userData.textColor + ' !important;', false, true, false);
			me._ht_video_file_title_gs.userData.hasScrollbar = false;
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
			me._ht_video_file_title_gs.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_title_gs.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_video_file_title_gs.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_video_file_title_gs.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_video_file_title_gs";
		me._ht_video_file_title_gs.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_title_gs.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_title_gs.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_title_gs.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_title_gs.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_title_gs.visible=((!me._ht_video_file_title_gs.material && Number(me._ht_video_file_title_gs.userData.opacity>0)) || (me._ht_video_file_title_gs.material && Number(me._ht_video_file_title_gs.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_title_gs.userData.visible=true;
				}
				else {
			me._ht_video_file_title_gs.visible=false;
			player.repaint();
			me._ht_video_file_title_gs.userData.visible=false;
				}
			}
		}
		me._ht_video_file_title_gs.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_video_file_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_title_gs.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_title_gs.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_title_gs.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_title_gs.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_title_gs.userData.transitions.length; i++) {
						if (me._ht_video_file_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_title_gs.userData.transitions[i].interval);
							me._ht_video_file_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_title_gs.material ? me._ht_video_file_title_gs.material.opacity : me._ht_video_file_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_title_gs.userData.transitions.splice(me._ht_video_file_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_title_gs.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_file_title_gs.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_title_gs.userData.transitions.length; i++) {
						if (me._ht_video_file_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_title_gs.userData.transitions[i].interval);
							me._ht_video_file_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_title_gs.material ? me._ht_video_file_title_gs.material.opacity : me._ht_video_file_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_title_gs.userData.transitions.splice(me._ht_video_file_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_title_gs.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_file_title_gs.userData.ggUpdatePosition=function (useTransition) {
				me._ht_video_file_title_gs.userData.ggUpdateText(true);
		}
		me._ht_video_file_bg.add(me._ht_video_file_title_gs);
		me._ht_video_file.add(me._ht_video_file_bg);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_video_file_popup_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(0.10, 0.10, 1.0);
		el.userData.width = 660;
		el.userData.height = 480;
		el.userData.scale = {x: 0.10, y: 0.10, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_popup_bg';
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
			let vis = me._ht_video_file_popup_bg.visible
			let parentEl = me._ht_video_file_popup_bg.parent;
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
			me._ht_video_file_popup_bg.userData.opacity = v;
			v = v * me._ht_video_file_popup_bg.userData.parentOpacity;
			if (me._ht_video_file_popup_bg.userData.setOpacityInternal) me._ht_video_file_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_popup_bg.children.length; i++) {
				let child = me._ht_video_file_popup_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_popup_bg.userData.parentOpacity = v;
			v = v * me._ht_video_file_popup_bg.userData.opacity
			if (me._ht_video_file_popup_bg.userData.setOpacityInternal) me._ht_video_file_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_popup_bg.children.length; i++) {
				let child = me._ht_video_file_popup_bg.children[i];
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
		me._ht_video_file_popup_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 30;
		el.userData.borderRadius.default.topRight = 30;
		el.userData.borderRadius.default.bottomRight = 30;
		el.userData.borderRadius.default.bottomLeft = 30;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_video_file_popup_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_video_file_popup_bg);
			if (skin.rectHasRoundedCorners(me._ht_video_file_popup_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_video_file_popup_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_video_file_popup_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_video_file_popup_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_video_file_popup_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_video_file_popup_bg_geometry';
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
				geometry.name = 'ht_video_file_popup_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_video_file_popup_bg.userData.backgroundColorAlpha = 0.666667;
		me._ht_video_file_popup_bg.userData.borderColorAlpha = 1;
		me._ht_video_file_popup_bg.userData.setOpacityInternal = function(v) {
			me._ht_video_file_popup_bg.material.opacity = v * me._ht_video_file_popup_bg.userData.backgroundColorAlpha;
			if (me._ht_video_file_popup_bg.userData.ggSubElement) {
				me._ht_video_file_popup_bg.userData.ggSubElement.material.opacity = v
				me._ht_video_file_popup_bg.userData.ggSubElement.visible = (v>0 && me._ht_video_file_popup_bg.userData.visible);
			}
			me._ht_video_file_popup_bg.visible = (v>0 && me._ht_video_file_popup_bg.userData.visible);
		}
		me._ht_video_file_popup_bg.userData.setBackgroundColor = function(v) {
			me._ht_video_file_popup_bg.material.color = v;
		}
		me._ht_video_file_popup_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_video_file_popup_bg.userData.backgroundColorAlpha = v;
			me._ht_video_file_popup_bg.userData.setOpacity(me._ht_video_file_popup_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 30, 30, 30, 30);
		el.userData.ggId="ht_video_file_popup_bg";
		me._ht_video_file_popup_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_popup_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_video_file_popup_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_video_file_popup_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_video_file_popup_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_video_file_popup_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_popup_bg.userData.transitions[i].interval);
							me._ht_video_file_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_video_file_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_popup_bg.position.x = (me._ht_video_file_popup_bg.position.x - me._ht_video_file_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_popup_bg.position.y = (me._ht_video_file_popup_bg.position.y - me._ht_video_file_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_popup_bg.userData.transitions.splice(me._ht_video_file_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_popup_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_video_file_popup_bg.userData.transitionValue_scale = {x: 0.1, y: 0.1, z: 1.0};
					for (var i = 0; i < me._ht_video_file_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_video_file_popup_bg.userData.transitions[i].interval);
							me._ht_video_file_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_video_file_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_video_file_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_video_file_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_video_file_popup_bg.position.x = (me._ht_video_file_popup_bg.position.x - me._ht_video_file_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_video_file_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_video_file_popup_bg.position.y = (me._ht_video_file_popup_bg.position.y - me._ht_video_file_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_video_file_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_video_file_popup_bg.userData.transitions.splice(me._ht_video_file_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_video_file_popup_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_video_file_popup_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_video_file_popup_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_video_file_popup_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_video_file_popup_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_video_file_popup_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_video_file_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_popup_bg.userData.transitions[i].interval);
							me._ht_video_file_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_popup_bg.material ? me._ht_video_file_popup_bg.material.opacity : me._ht_video_file_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_popup_bg.userData.transitions.splice(me._ht_video_file_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_video_file_popup_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_video_file_popup_bg.userData.transitions.length; i++) {
						if (me._ht_video_file_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_video_file_popup_bg.userData.transitions[i].interval);
							me._ht_video_file_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_video_file_popup_bg.material ? me._ht_video_file_popup_bg.material.opacity : me._ht_video_file_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_video_file_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_video_file_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_video_file_popup_bg.userData.transitions.splice(me._ht_video_file_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_video_file_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_video_file_popup_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		geometry = new THREE.PlaneGeometry(6, 3.8, 5, 5 );
		geometry.name = 'ht_video_file_popup_geometry';
		material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_video_file_popup_material';
		el = new THREE.Mesh( geometry, material );
		el.translateX(0);
		el.translateY(-0.1);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 600;
		el.userData.height = 380;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_popup';
		el.userData.x = 0;
		el.userData.y = -0.1;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.setOpacityInternal = function(v) {
			if (me._ht_video_file_popup.material) me._ht_video_file_popup.material.opacity = v;
			me._ht_video_file_popup.visible = (v>0 && me._ht_video_file_popup.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_video_file_popup.visible
			let parentEl = me._ht_video_file_popup.parent;
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
			me._ht_video_file_popup.userData.opacity = v;
			v = v * me._ht_video_file_popup.userData.parentOpacity;
			if (me._ht_video_file_popup.userData.setOpacityInternal) me._ht_video_file_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_popup.children.length; i++) {
				let child = me._ht_video_file_popup.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_popup.userData.parentOpacity = v;
			v = v * me._ht_video_file_popup.userData.opacity
			if (me._ht_video_file_popup.userData.setOpacityInternal) me._ht_video_file_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_popup.children.length; i++) {
				let child = me._ht_video_file_popup.children[i];
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
		me._ht_video_file_popup = el;
		me._ht_video_file_popup.userData.seekbars = [];
		me._ht_video_file_popup.userData.ggInitMedia = function(media) {
			if (me._ht_video_file_popup__vid) me._ht_video_file_popup__vid.pause();
			me._ht_video_file_popup__vid = document.createElement('video');
			player.registerVideoElement('ht_video_file_popup', me._ht_video_file_popup__vid);
			me._ht_video_file_popup__vid.setAttribute('autoplay', '');
			me._ht_video_file_popup__vid.setAttribute('crossOrigin', 'anonymous');
			me._ht_video_file_popup__source = document.createElement('source');
			me._ht_video_file_popup__source.setAttribute('src', media);
			me._ht_video_file_popup__vid.addEventListener('loadedmetadata', function() {
				let videoAR = me._ht_video_file_popup__vid.videoWidth / me._ht_video_file_popup__vid.videoHeight;
				let elAR = me._ht_video_file_popup.userData.width / me._ht_video_file_popup.userData.height;
				if (videoAR > elAR) {
					me._ht_video_file_popup.scale.set(1, (me._ht_video_file_popup.userData.width / videoAR) / me._ht_video_file_popup.userData.height, 1);
				} else {
					me._ht_video_file_popup.scale.set((me._ht_video_file_popup.userData.height * videoAR) / me._ht_video_file_popup.userData.width, 1, 1);
				}
			}, false);
			me._ht_video_file_popup__vid.appendChild(me._ht_video_file_popup__source);
			videoTexture = new THREE.VideoTexture( me._ht_video_file_popup__vid );
			videoTexture.name = 'ht_video_file_popup_videoTexture';
			videoTexture.minFilter = THREE.LinearFilter;
			videoTexture.magFilter = THREE.LinearFilter;
			videoTexture.format = THREE.RGBAFormat;
			videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, transparent: true} );
			videoMaterial.name = 'ht_video_file_popup_videoMaterial';
			videoMaterial.alphaTest = 0.5;
			me._ht_video_file_popup.material = videoMaterial;
		}
		el.userData.ggId="ht_video_file_popup";
		me._ht_video_file_popup.userData.ggIsActive=function() {
			if (me._ht_video_file_popup__vid != null) {
				return (me._ht_video_file_popup__vid.paused == false && me._ht_video_file_popup__vid.ended == false);
			} else {
				return false;
			}
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_popup.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_video_file_popup.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_video_file_popup.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_video_file_popup.ggCurrentLogicStateVisible == 0) {
			me._ht_video_file_popup.visible=((!me._ht_video_file_popup.material && Number(me._ht_video_file_popup.userData.opacity>0)) || (me._ht_video_file_popup.material && Number(me._ht_video_file_popup.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_popup.userData.visible=true;
					if (me._ht_video_file_popup.userData.ggVideoNotLoaded) {
						me._ht_video_file_popup.userData.ggInitMedia(me._ht_video_file_popup.ggVideoSource);
					}
				}
				else {
			me._ht_video_file_popup.visible=false;
			player.repaint();
			me._ht_video_file_popup.userData.visible=false;
					me._ht_video_file_popup.userData.ggInitMedia('');
				}
			}
		}
		me._ht_video_file_popup.userData.onclick=function (e) {
			if (me._ht_video_file_popup.ggApiPlayer) {
				if (me._ht_video_file_popup.ggApiPlayerType == 'youtube') {
					let youtubeMediaFunction = function() {
						if (me._ht_video_file_popup.ggApiPlayer.getPlayerState() == 1) {
							me._ht_video_file_popup.ggApiPlayer.pauseVideo();
						} else {
							me._ht_video_file_popup.ggApiPlayer.playVideo();
						}
					};
					if (me._ht_video_file_popup.ggApiPlayerReady) {
						youtubeMediaFunction();
					} else {
						let youtubeApiInterval = setInterval(function() {
							if (me._ht_video_file_popup.ggApiPlayerReady) {
								clearInterval(youtubeApiInterval);
								youtubeMediaFunction();
							}
						}, 100);
					}
				} else if (me._ht_video_file_popup.ggApiPlayerType == 'vimeo') {
					var promise = me._ht_video_file_popup.ggApiPlayer.getPaused();
					promise.then(function(result) {
						if (result == true) {
							me._ht_video_file_popup.ggApiPlayer.play();
						} else {
							me._ht_video_file_popup.ggApiPlayer.pause();
						}
					});
				}
			} else {
				player.playPauseSound("ht_video_file_popup","1");
			}
		}
		me._ht_video_file_popup.userData.hasOwnClickAction = true;
		me._ht_video_file_popup.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file_popup_bg.add(me._ht_video_file_popup);
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
			if (me._ht_video_file_popup_close.userData.svgGroupNormal) me._ht_video_file_popup_close.userData.setOpacityInState(me._ht_video_file_popup_close.userData.svgGroupNormal, v);
			if (me._ht_video_file_popup_close.userData.svgGroupOver) me._ht_video_file_popup_close.userData.setOpacityInState(me._ht_video_file_popup_close.userData.svgGroupOver, v);
			if (me._ht_video_file_popup_close.userData.svgGroupActive) me._ht_video_file_popup_close.userData.setOpacityInState(me._ht_video_file_popup_close.userData.svgGroupActive, v);
			me._ht_video_file_popup_close.visible = (v>0 && me._ht_video_file_popup_close.userData.visible);
		}
		el.translateX(2.85);
		el.translateY(2.05);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 40;
		el.userData.height = 40;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_video_file_popup_close';
		el.userData.x = 2.85;
		el.userData.y = 2.05;
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
			let vis = me._ht_video_file_popup_close.visible
			let parentEl = me._ht_video_file_popup_close.parent;
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
			me._ht_video_file_popup_close.userData.opacity = v;
			v = v * me._ht_video_file_popup_close.userData.parentOpacity;
			if (me._ht_video_file_popup_close.userData.setOpacityInternal) me._ht_video_file_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_popup_close.children.length; i++) {
				let child = me._ht_video_file_popup_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_video_file_popup_close.userData.parentOpacity = v;
			v = v * me._ht_video_file_popup_close.userData.opacity
			if (me._ht_video_file_popup_close.userData.setOpacityInternal) me._ht_video_file_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_video_file_popup_close.children.length; i++) {
				let child = me._ht_video_file_popup_close.children[i];
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
		me._ht_video_file_popup_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(40 / 100.0, 40 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_video_file_popup_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_video_file_popup_close_clickTargetMaterial';
		me._ht_video_file_popup_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_video_file_popup_close.userData.clickTarget.name = 'ht_video_file_popup_close_clickTarget';
		me._ht_video_file_popup_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_video_file_popup_close.userData.clickTarget.visible = false;
		me._ht_video_file_popup_close.add(me._ht_video_file_popup_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_video_file_popup_close.svg', me._ht_video_file_popup_close.userData.width / 100.0, me._ht_video_file_popup_close.userData.height / 100.0);
			me._ht_video_file_popup_close.add(group);
			me._ht_video_file_popup_close.userData.svgGroupNormal = group;
			me._ht_video_file_popup_close.userData.setOpacityInState(group, me._ht_video_file_popup_close.userData.opacity);
			player.repaint(3);
		})();
		(async() => {
			group = await player.loadSvg3D(basePath + 'images_vr/ht_video_file_popup_close__o.svg', me._ht_video_file_popup_close.userData.width / 100.0, me._ht_video_file_popup_close.userData.height / 100.0);
			group.visible = false;
			me._ht_video_file_popup_close.add(group);
			me._ht_video_file_popup_close.userData.svgGroupOver = group;
			me._ht_video_file_popup_close.userData.setOpacityInState(group, me._ht_video_file_popup_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_video_file_popup_close";
		me._ht_video_file_popup_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_video_file_popup_close.userData.onclick=function (e) {
			player.setVariableValue('open_video_hs', player.getVariableValue('open_video_hs').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_video_file_popup_close.userData.hasOwnClickAction = true;
		me._ht_video_file_popup_close.userData.onmouseenter=function (e) {
			me._ht_video_file_popup_close.userData.svgGroupNormal.visible = false;
			me._ht_video_file_popup_close.userData.svgGroupOver.visible = true;
			me.elementMouseOver['ht_video_file_popup_close']=true;
		}
		me._ht_video_file_popup_close.userData.onmouseleave=function (e) {
			me._ht_video_file_popup_close.userData.svgGroupNormal.visible = true;
			me._ht_video_file_popup_close.userData.svgGroupOver.visible = false;
			if (me._ht_video_file_popup_close.userData.svgGroupActive) me._ht_video_file_popup_close.userData.svgGroupActive.visible = false;
			me.elementMouseOver['ht_video_file_popup_close']=false;
		}
		me._ht_video_file_popup_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_video_file_popup_bg.add(me._ht_video_file_popup_close);
		me._ht_video_file.add(me._ht_video_file_popup_bg);
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
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
				((me.hotspot.customimage == "")) || 
				(((player.getVariableValue('open_video_hs') !== null) && (player.getVariableValue('open_video_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
			me._ht_video_file_customimage.visible=false;
			player.repaint();
			me._ht_video_file_customimage.userData.visible=false;
				}
				else {
			me._ht_video_file_customimage.visible=((!me._ht_video_file_customimage.material && Number(me._ht_video_file_customimage.userData.opacity>0)) || (me._ht_video_file_customimage.material && Number(me._ht_video_file_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_video_file_customimage.userData.visible=true;
				}
			}
		}
		me._ht_video_file_customimage.userData.onclick=function (e) {
			player.setVariableValue('open_video_hs', player.getVariableValue('open_video_hs') + "<"+me.hotspot.id+">");
			me._ht_video_file_popup.userData.ggInitMedia(player._(me.hotspot.url));
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
		me._ht_video_file_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_bg.traverse((obj)=>{
				if (me._ht_video_file_bg.material) {
					me._ht_video_file_bg.material.transparent = (me._ht_video_file_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_file_bg']=false;
		me._ht_video_file_bg.logicBlock_scaling();
		me._ht_video_file_bg.logicBlock_visible();
		me._ht_video_file_bg.logicBlock_alpha();
		me._ht_video_file_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_icon.traverse((obj)=>{
				if (me._ht_video_file_icon.material) {
					me._ht_video_file_icon.material.transparent = (me._ht_video_file_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_file_title.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_title.traverse((obj)=>{
				if (me._ht_video_file_title.material) {
					me._ht_video_file_title.material.transparent = (me._ht_video_file_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_video_file_title.userData.ggUpdateText(true);
		me._ht_video_file_title.logicBlock_visible();
		me._ht_video_file_title.logicBlock_alpha();
		me._ht_video_file_title_gs.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_title_gs.traverse((obj)=>{
				if (me._ht_video_file_title_gs.material) {
					me._ht_video_file_title_gs.material.transparent = (me._ht_video_file_title_gs.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_video_file_title_gs.userData.ggUpdateText(true);
		me._ht_video_file_title_gs.logicBlock_visible();
		me._ht_video_file_title_gs.logicBlock_alpha();
		me._ht_video_file_popup_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_popup_bg.traverse((obj)=>{
				if (me._ht_video_file_popup_bg.material) {
					me._ht_video_file_popup_bg.material.transparent = (me._ht_video_file_popup_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_file_popup_bg.logicBlock_scaling();
		me._ht_video_file_popup_bg.logicBlock_alpha();
		me._ht_video_file_popup.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_popup.traverse((obj)=>{
				if (me._ht_video_file_popup.material) {
					me._ht_video_file_popup.material.transparent = (me._ht_video_file_popup.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_video_file_popup.userData.ggVideoSource = 'media_vr/';
		me._ht_video_file_popup.userData.ggVideoNotLoaded = true;
		me._ht_video_file_popup.logicBlock_visible();
		me._ht_video_file_popup_close.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_video_file_popup_close.traverse((obj)=>{
				if (me._ht_video_file_popup_close.material) {
					me._ht_video_file_popup_close.material.transparent = (me._ht_video_file_popup_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_video_file_popup_close']=false;
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
				me._ht_video_file_bg.logicBlock_visible();
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
					me._ht_video_file_bg.traverse((obj)=>{
						if (me._ht_video_file_bg.material) {
							me._ht_video_file_bg.material.transparent = (me._ht_video_file_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_bg.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_icon.traverse((obj)=>{
						if (me._ht_video_file_icon.material) {
							me._ht_video_file_icon.material.transparent = (me._ht_video_file_icon.userData.zIndexCurrent > 0);
							}
					});
				}
					me._ht_video_file_title.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_title.traverse((obj)=>{
						if (me._ht_video_file_title.material) {
							me._ht_video_file_title.material.transparent = (me._ht_video_file_title.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_title.logicBlock_visible();
					me._ht_video_file_title_gs.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_title_gs.traverse((obj)=>{
						if (me._ht_video_file_title_gs.material) {
							me._ht_video_file_title_gs.material.transparent = (me._ht_video_file_title_gs.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_title_gs.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_popup_bg.traverse((obj)=>{
						if (me._ht_video_file_popup_bg.material) {
							me._ht_video_file_popup_bg.material.transparent = (me._ht_video_file_popup_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_popup_bg.logicBlock_scaling();
				me._ht_video_file_popup_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_popup.traverse((obj)=>{
						if (me._ht_video_file_popup.material) {
							me._ht_video_file_popup.material.transparent = (me._ht_video_file_popup.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_video_file_popup.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_video_file_popup_close.traverse((obj)=>{
						if (me._ht_video_file_popup_close.material) {
							me._ht_video_file_popup_close.material.transparent = (me._ht_video_file_popup_close.userData.zIndexCurrent > 0);
							}
					});
				}
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
				me._ht_video_file_bg.logicBlock_visible();
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_popup_bg.logicBlock_scaling();
				me._ht_video_file_popup_bg.logicBlock_alpha();
				me._ht_video_file_popup.logicBlock_visible();
				me._ht_video_file_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_open_video_hs=function() {
				me._ht_video_file_bg.logicBlock_alpha();
				me._ht_video_file_popup_bg.logicBlock_scaling();
				me._ht_video_file_popup_bg.logicBlock_alpha();
				me._ht_video_file_popup.logicBlock_visible();
				me._ht_video_file_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_video_file;
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
		el.userData.x = 0.65;
		el.userData.y = 2.08;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_bg_material';
			el.material = material;
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
		el.name = 'ht_info_bg';
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
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
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
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
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
		me._ht_info_bg.userData.backgroundColorAlpha = 0.588235;
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
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
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
				((me.elementMouseOver['ht_info_bg'] == true))
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
					me._ht_info_bg.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
		me._ht_info_bg.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage == ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_bg.ggCurrentLogicStateVisible == 0) {
			me._ht_info_bg.visible=((!me._ht_info_bg.material && Number(me._ht_info_bg.userData.opacity>0)) || (me._ht_info_bg.material && Number(me._ht_info_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_bg.userData.visible=true;
				}
				else {
			me._ht_info_bg.visible=false;
			player.repaint();
			me._ht_info_bg.userData.visible=false;
				}
			}
		}
		me._ht_info_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_image_hs') !== null) && (player.getVariableValue('open_image_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
		me._ht_info_bg.userData.onclick=function (e) {
			player.setVariableValue('open_info_hs', player.getVariableValue('open_info_hs') + "<"+me.hotspot.id+">");
		}
		me._ht_info_bg.userData.hasOwnClickAction = true;
		me._ht_info_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_info_bg']=true;
			me._ht_info_title.logicBlock_alpha();
			me._ht_info_title_gs.logicBlock_alpha();
			me._ht_info_bg.logicBlock_scaling();
		}
		me._ht_info_bg.userData.ontouchend=function (e) {
			me._ht_info_bg.logicBlock_scaling();
		}
		me._ht_info_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_info_bg']=false;
			me._ht_info_title.logicBlock_alpha();
			me._ht_info_title_gs.logicBlock_alpha();
			me._ht_info_bg.logicBlock_scaling();
		}
		me._ht_info_bg.userData.ggUpdatePosition=function (useTransition) {
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
		el.userData.width = 36;
		el.userData.height = 36;
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
		clickTargetGeometry = new THREE.PlaneGeometry(36 / 100.0, 36 / 100.0, 5, 5 );
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
		me._ht_info_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info_bg.add(me._ht_info_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
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
		el.userData.y = -0.325;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
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
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
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
		me._ht_info_title.userData.backgroundColorAlpha = 1;
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
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
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
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_info_title.userData.scrollPosPercent ? tmpCanv.height * me._ht_info_title.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_info_title.userData.boxWidthCanv / 100.0;
		height = me._ht_info_title.userData.boxHeightCanv / 100.0;
		me._ht_info_title.userData.width = me._ht_info_title.userData.boxWidthCanv;
		me._ht_info_title.userData.height = me._ht_info_title.userData.boxHeightCanv;
		me._ht_info_title.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_info_title, 0, -20);
		me._ht_info_title.position.x = newPos.x;
		me._ht_info_title.position.y = newPos.y;
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
			skin.paintTextDivToCanvas(me._ht_info_title, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me._ht_info_title.userData.textColor + ' !important;', false, true, false);
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
		me._ht_info_title.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_title.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_title.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_title.ggCurrentLogicStateVisible == 0) {
			me._ht_info_title.visible=false;
			player.repaint();
			me._ht_info_title.userData.visible=false;
				}
				else {
			me._ht_info_title.visible=((!me._ht_info_title.material && Number(me._ht_info_title.userData.opacity>0)) || (me._ht_info_title.material && Number(me._ht_info_title.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_title.userData.visible=true;
				}
			}
		}
		me._ht_info_title.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_info_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_title.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_title.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_title.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_title.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_title.userData.transitions.length; i++) {
						if (me._ht_info_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_title.userData.transitions[i].interval);
							me._ht_info_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_title.material ? me._ht_info_title.material.opacity : me._ht_info_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_title.userData.transitions.splice(me._ht_info_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_title.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_info_title.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_title.userData.transitions.length; i++) {
						if (me._ht_info_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_title.userData.transitions[i].interval);
							me._ht_info_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_title.material ? me._ht_info_title.material.opacity : me._ht_info_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_title.userData.transitions.splice(me._ht_info_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_title.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_info_title.userData.ggUpdatePosition=function (useTransition) {
				me._ht_info_title.userData.ggUpdateText(true);
		}
		me._ht_info_bg.add(me._ht_info_title);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_title_gs_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_title_gs';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_info_title_gs.visible
			let parentEl = me._ht_info_title_gs.parent;
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
			me._ht_info_title_gs.userData.opacity = v;
			v = v * me._ht_info_title_gs.userData.parentOpacity;
			if (me._ht_info_title_gs.userData.setOpacityInternal) me._ht_info_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_title_gs.children.length; i++) {
				let child = me._ht_info_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_title_gs.userData.parentOpacity = v;
			v = v * me._ht_info_title_gs.userData.opacity
			if (me._ht_info_title_gs.userData.setOpacityInternal) me._ht_info_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_title_gs.children.length; i++) {
				let child = me._ht_info_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_info_title_gs = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 6;
		el.userData.borderRadius.default.topRight = 6;
		el.userData.borderRadius.default.bottomRight = 6;
		el.userData.borderRadius.default.bottomLeft = 6;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_title_gs;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_title_gs);
			if (skin.rectHasRoundedCorners(me._ht_info_title_gs)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_title_gs.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_title_gs.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_title_gs.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_title_gs.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_info_title_gs_geometry';
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
				geometry.name = 'ht_info_title_gs_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_title_gs.userData.backgroundColorAlpha = 1;
		me._ht_info_title_gs.userData.borderColorAlpha = 1;
		me._ht_info_title_gs.userData.setOpacityInternal = function(v) {
			me._ht_info_title_gs.material.opacity = v;
			if (me._ht_info_title_gs.userData.hasScrollbar) {
				me._ht_info_title_gs.userData.scrollbar.material.opacity = v;
				me._ht_info_title_gs.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_title_gs.userData.ggSubElement) {
				me._ht_info_title_gs.userData.ggSubElement.material.opacity = v
				me._ht_info_title_gs.userData.ggSubElement.visible = (v>0 && me._ht_info_title_gs.userData.visible);
			}
			me._ht_info_title_gs.visible = (v>0 && me._ht_info_title_gs.userData.visible);
		}
		me._ht_info_title_gs.userData.setBackgroundColor = function(v) {
			me._ht_info_title_gs.material.color = v;
		}
		me._ht_info_title_gs.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_title_gs.userData.backgroundColorAlpha = v;
			me._ht_info_title_gs.userData.setOpacity(me._ht_info_title_gs.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 6, 6, 6, 6);
		el.userData.backgroundColor = player.getTHREESkinColor('#4a4a4a');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_info_title_gs;
			var canv = me._ht_info_title_gs.userData.textCanvas;
			var ctx = me._ht_info_title_gs.userData.textCanvasContext;
			var tmpCanv = me._ht_info_title_gs.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_title_gs.userData.backgroundColor.r * 255 + ', ' + me._ht_info_title_gs.userData.backgroundColor.g * 255 + ', ' + me._ht_info_title_gs.userData.backgroundColor.b * 255 + ', ' + me._ht_info_title_gs.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_info_title_gs.userData.scrollPosPercent ? tmpCanv.height * me._ht_info_title_gs.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_info_title_gs.userData.boxWidthCanv / 100.0;
		height = me._ht_info_title_gs.userData.boxHeightCanv / 100.0;
		me._ht_info_title_gs.userData.width = me._ht_info_title_gs.userData.boxWidthCanv;
		me._ht_info_title_gs.userData.height = me._ht_info_title_gs.userData.boxHeightCanv;
		me._ht_info_title_gs.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_info_title_gs, 0, -20);
		me._ht_info_title_gs.position.x = newPos.x;
		me._ht_info_title_gs.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_title_gs_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_title_gs.material.map) {
				me._ht_info_title_gs.material.map.dispose();
			}
			me._ht_info_title_gs.material.map = textTexture;
			me._ht_info_title_gs.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_info_title_gs, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_info_title_gs, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 1px; overflow: hidden;' + '; color: ' + me._ht_info_title_gs.userData.textColor + ' !important;', false, true, false);
			me._ht_info_title_gs.userData.hasScrollbar = false;
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
			me._ht_info_title_gs.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_title_gs.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_title_gs.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_title_gs.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_title_gs";
		me._ht_info_title_gs.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_title_gs.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_info_title_gs.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_info_title_gs.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_info_title_gs.ggCurrentLogicStateVisible == 0) {
			me._ht_info_title_gs.visible=((!me._ht_info_title_gs.material && Number(me._ht_info_title_gs.userData.opacity>0)) || (me._ht_info_title_gs.material && Number(me._ht_info_title_gs.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_title_gs.userData.visible=true;
				}
				else {
			me._ht_info_title_gs.visible=false;
			player.repaint();
			me._ht_info_title_gs.userData.visible=false;
				}
			}
		}
		me._ht_info_title_gs.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_info_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_title_gs.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_title_gs.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_title_gs.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_title_gs.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_title_gs.userData.transitions.length; i++) {
						if (me._ht_info_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_title_gs.userData.transitions[i].interval);
							me._ht_info_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_title_gs.material ? me._ht_info_title_gs.material.opacity : me._ht_info_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_title_gs.userData.transitions.splice(me._ht_info_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_title_gs.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_info_title_gs.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_title_gs.userData.transitions.length; i++) {
						if (me._ht_info_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_title_gs.userData.transitions[i].interval);
							me._ht_info_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_title_gs.material ? me._ht_info_title_gs.material.opacity : me._ht_info_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_title_gs.userData.transitions.splice(me._ht_info_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_title_gs.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_info_title_gs.userData.ggUpdatePosition=function (useTransition) {
				me._ht_info_title_gs.userData.ggUpdateText(true);
		}
		me._ht_info_bg.add(me._ht_info_title_gs);
		me._ht_info.add(me._ht_info_bg);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_popup_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(0.10, 0.10, 1.0);
		el.userData.width = 660;
		el.userData.height = 480;
		el.userData.scale = {x: 0.10, y: 0.10, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_popup_bg';
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
			let vis = me._ht_info_popup_bg.visible
			let parentEl = me._ht_info_popup_bg.parent;
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
			me._ht_info_popup_bg.userData.opacity = v;
			v = v * me._ht_info_popup_bg.userData.parentOpacity;
			if (me._ht_info_popup_bg.userData.setOpacityInternal) me._ht_info_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_popup_bg.children.length; i++) {
				let child = me._ht_info_popup_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_popup_bg.userData.parentOpacity = v;
			v = v * me._ht_info_popup_bg.userData.opacity
			if (me._ht_info_popup_bg.userData.setOpacityInternal) me._ht_info_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_popup_bg.children.length; i++) {
				let child = me._ht_info_popup_bg.children[i];
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
		me._ht_info_popup_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 30;
		el.userData.borderRadius.default.topRight = 30;
		el.userData.borderRadius.default.bottomRight = 30;
		el.userData.borderRadius.default.bottomLeft = 30;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_info_popup_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_popup_bg);
			if (skin.rectHasRoundedCorners(me._ht_info_popup_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_popup_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_popup_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_popup_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_popup_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_info_popup_bg_geometry';
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
				geometry.name = 'ht_info_popup_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_popup_bg.userData.backgroundColorAlpha = 0.666667;
		me._ht_info_popup_bg.userData.borderColorAlpha = 1;
		me._ht_info_popup_bg.userData.setOpacityInternal = function(v) {
			me._ht_info_popup_bg.material.opacity = v * me._ht_info_popup_bg.userData.backgroundColorAlpha;
			if (me._ht_info_popup_bg.userData.ggSubElement) {
				me._ht_info_popup_bg.userData.ggSubElement.material.opacity = v
				me._ht_info_popup_bg.userData.ggSubElement.visible = (v>0 && me._ht_info_popup_bg.userData.visible);
			}
			me._ht_info_popup_bg.visible = (v>0 && me._ht_info_popup_bg.userData.visible);
		}
		me._ht_info_popup_bg.userData.setBackgroundColor = function(v) {
			me._ht_info_popup_bg.material.color = v;
		}
		me._ht_info_popup_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_popup_bg.userData.backgroundColorAlpha = v;
			me._ht_info_popup_bg.userData.setOpacity(me._ht_info_popup_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 30, 30, 30, 30);
		el.userData.ggId="ht_info_popup_bg";
		me._ht_info_popup_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_popup_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('open_info_hs') !== null) && (player.getVariableValue('open_info_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_info_popup_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_info_popup_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_info_popup_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_info_popup_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_info_popup_bg.userData.transitions.length; i++) {
						if (me._ht_info_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_popup_bg.userData.transitions[i].interval);
							me._ht_info_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_info_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_popup_bg.position.x = (me._ht_info_popup_bg.position.x - me._ht_info_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_info_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_info_popup_bg.position.y = (me._ht_info_popup_bg.position.y - me._ht_info_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_info_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_popup_bg.userData.transitions.splice(me._ht_info_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_popup_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_info_popup_bg.userData.transitionValue_scale = {x: 0.1, y: 0.1, z: 1.0};
					for (var i = 0; i < me._ht_info_popup_bg.userData.transitions.length; i++) {
						if (me._ht_info_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_info_popup_bg.userData.transitions[i].interval);
							me._ht_info_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_info_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_info_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_info_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_info_popup_bg.position.x = (me._ht_info_popup_bg.position.x - me._ht_info_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_info_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_info_popup_bg.position.y = (me._ht_info_popup_bg.position.y - me._ht_info_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_info_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_info_popup_bg.userData.transitions.splice(me._ht_info_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_info_popup_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_info_popup_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_info_hs') !== null) && (player.getVariableValue('open_info_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_info_popup_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_info_popup_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_info_popup_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_info_popup_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_info_popup_bg.userData.transitions.length; i++) {
						if (me._ht_info_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_popup_bg.userData.transitions[i].interval);
							me._ht_info_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_popup_bg.material ? me._ht_info_popup_bg.material.opacity : me._ht_info_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_popup_bg.userData.transitions.splice(me._ht_info_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_info_popup_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_info_popup_bg.userData.transitions.length; i++) {
						if (me._ht_info_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_info_popup_bg.userData.transitions[i].interval);
							me._ht_info_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_info_popup_bg.material ? me._ht_info_popup_bg.material.opacity : me._ht_info_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_info_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_info_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_info_popup_bg.userData.transitions.splice(me._ht_info_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_info_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_info_popup_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_info_popup_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.2);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 600;
		el.userData.height = 400;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_popup';
		el.userData.x = 0;
		el.userData.y = -0.2;
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
			let vis = me._ht_info_popup.visible
			let parentEl = me._ht_info_popup.parent;
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
			me._ht_info_popup.userData.opacity = v;
			v = v * me._ht_info_popup.userData.parentOpacity;
			if (me._ht_info_popup.userData.setOpacityInternal) me._ht_info_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_popup.children.length; i++) {
				let child = me._ht_info_popup.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_popup.userData.parentOpacity = v;
			v = v * me._ht_info_popup.userData.opacity
			if (me._ht_info_popup.userData.setOpacityInternal) me._ht_info_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_popup.children.length; i++) {
				let child = me._ht_info_popup.children[i];
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
		me._ht_info_popup = el;
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
			let el = me._ht_info_popup;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_info_popup);
			if (skin.rectHasRoundedCorners(me._ht_info_popup)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_info_popup.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_info_popup.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_info_popup.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_info_popup.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_info_popup_geometry';
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
				geometry.name = 'ht_info_popup_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_info_popup.userData.backgroundColorAlpha = 1;
		me._ht_info_popup.userData.borderColorAlpha = 1;
		me._ht_info_popup.userData.setOpacityInternal = function(v) {
			me._ht_info_popup.material.opacity = v;
			if (me._ht_info_popup.userData.hasScrollbar) {
				me._ht_info_popup.userData.scrollbar.material.opacity = v;
				me._ht_info_popup.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_info_popup.userData.ggSubElement) {
				me._ht_info_popup.userData.ggSubElement.material.opacity = v
				me._ht_info_popup.userData.ggSubElement.visible = (v>0 && me._ht_info_popup.userData.visible);
			}
			me._ht_info_popup.visible = (v>0 && me._ht_info_popup.userData.visible);
		}
		me._ht_info_popup.userData.setBackgroundColor = function(v) {
			me._ht_info_popup.material.color = v;
		}
		me._ht_info_popup.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_popup.userData.backgroundColorAlpha = v;
			me._ht_info_popup.userData.setOpacity(me._ht_info_popup.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#000000';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 1200;
		canvas.height = 800;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_info_popup;
			var canv = me._ht_info_popup.userData.textCanvas;
			var ctx = me._ht_info_popup.userData.textCanvasContext;
			var tmpCanv = me._ht_info_popup.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_info_popup.userData.backgroundColor.r * 255 + ', ' + me._ht_info_popup.userData.backgroundColor.g * 255 + ', ' + me._ht_info_popup.userData.backgroundColor.b * 255 + ', ' + me._ht_info_popup.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_info_popup.userData.scrollPosPercent ? tmpCanv.height * me._ht_info_popup.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_info_popup_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_info_popup.material.map) {
				me._ht_info_popup.material.map.dispose();
			}
			me._ht_info_popup.material.map = textTexture;
			me._ht_info_popup.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_info_popup, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_info_popup, 'box-sizing: border-box; width: 600px; height: auto; font-size: 22px; font-weight: inherit; color: #000000; text-align: left; white-space: pre-line; padding: 15px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._ht_info_popup.userData.textColor + ' !important;', false, false, true, true);
			if (me._ht_info_popup.userData.totalHeightCanv > (me._ht_info_popup.userData.height)) {
				skin.paintTextDivToCanvas(me._ht_info_popup, 'box-sizing: border-box; width: 580px; height: auto; font-size: 22px; font-weight: inherit; color: #000000; text-align: left; white-space: pre-line; padding: 15px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._ht_info_popup.userData.textColor + ' !important;', false, false, true);
			} else {
			skin.paintTextDivToCanvas(me._ht_info_popup, 'box-sizing: border-box; width: 600px; height: auto; font-size: 22px; font-weight: inherit; color: #000000; text-align: left; white-space: pre-line; padding: 15px; overflow: hidden; overflow-y: auto;' + '; color: ' + me._ht_info_popup.userData.textColor + ' !important;', false, false, true);
			}
			me._ht_info_popup.userData.scrollPosPercent = 0.0
			if (me._ht_info_popup.userData.totalHeightCanv > ((me._ht_info_popup.userData.height))) {
				me._ht_info_popup.userData.pagePercent = ((me._ht_info_popup.userData.height) - me._ht_info_popup.userData.lineHeight) / me._ht_info_popup.userData.totalHeightCanv;
				me._ht_info_popup.userData.maxScrollPercent = (me._ht_info_popup.userData.totalHeightCanv - (1 * (me._ht_info_popup.userData.height))) / me._ht_info_popup.userData.totalHeightCanv;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_popup.userData.height / 100.0, 5, 5 );
				geometry.name = 'ht_info_popup_scrollbarBgGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x7f7f7f, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_popup_scrollbarBgMaterial';
				me._ht_info_popup.userData.scrollbarBg = new THREE.Mesh( geometry, material );
				me._ht_info_popup.userData.scrollbarBg.name = 'ht_info_popup_scrollbarBg';
				me._ht_info_popup.add(me._ht_info_popup.userData.scrollbarBg);
				me._ht_info_popup.userData.scrollbarXPos = (me._ht_info_popup.userData.width - 20) / 200.0;
				me._ht_info_popup.userData.scrollbarBg.position.x = me._ht_info_popup.userData.scrollbarXPos;
				me._ht_info_popup.userData.scrollbarBg.position.z = me._ht_info_popup.position.z + 0.01;
				me._ht_info_popup.userData.scrollbarBg.userData.stopPropagation = true;
				me._ht_info_popup.userData.scrollbarHeight = ((1 * me._ht_info_popup.userData.height) / me._ht_info_popup.userData.totalHeightCanv) * me._ht_info_popup.userData.height;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_popup.userData.scrollbarHeight / 100.0, 5, 5 );
				geometry.name = 'ht_info_popup_scrollbarGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0xbfbfbf, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_popup_scrollbarMaterial';
				me._ht_info_popup.userData.scrollbar = new THREE.Mesh( geometry, material );
				me._ht_info_popup.userData.scrollbar.name = 'ht_info_popup_scrollbar';
				me._ht_info_popup.add(me._ht_info_popup.userData.scrollbar);
				me._ht_info_popup.userData.scrollbar.position.x = me._ht_info_popup.userData.scrollbarXPos;
				me._ht_info_popup.userData.scrollbar.position.z = me._ht_info_popup.position.z + 0.02;
				me._ht_info_popup.userData.scrollbarYPosMin = (me._ht_info_popup.userData.height - me._ht_info_popup.userData.scrollbarHeight) / 200.0;
				me._ht_info_popup.userData.scrollbarYPosMax = me._ht_info_popup.userData.scrollbarYPosMin - (me._ht_info_popup.userData.height - me._ht_info_popup.userData.scrollbarHeight) / 100.0;
				me._ht_info_popup.userData.scrollbar.position.y = me._ht_info_popup.userData.scrollbarYPosMin;
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_popup.userData.height / 200.0, 5, 5 );
				geometry.name = 'ht_info_popup_scrollbarPageDownGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_popup_scrollbarPageDownMaterial';
				me._ht_info_popup.userData.scrollbarPageDown = new THREE.Mesh( geometry, material );
				me._ht_info_popup.userData.scrollbarPageDown.name = 'ht_info_popup_scrollbarPageDown';
				me._ht_info_popup.userData.scrollbarPageDown.userData.onclick = function() {
					me._ht_info_popup.userData.scrollPosPercent -= me._ht_info_popup.userData.pagePercent;
					me._ht_info_popup.userData.scrollPosPercent = Math.max(me._ht_info_popup.userData.scrollPosPercent, 0);
					me._ht_info_popup.userData.ggTextureFromCanvas();
					me._ht_info_popup.userData.scrollbar.position.y += (me._ht_info_popup.userData.height * me._ht_info_popup.userData.pagePercent) / 100.0;
					me._ht_info_popup.userData.scrollbar.position.y = Math.min(me._ht_info_popup.userData.scrollbar.position.y, me._ht_info_popup.userData.scrollbarYPosMin);
				}
				me._ht_info_popup.userData.scrollbarPageDown.position.x = me._ht_info_popup.userData.scrollbarXPos;
				me._ht_info_popup.userData.scrollbarPageDown.position.y = me._ht_info_popup.userData.height / 400.0;
				me._ht_info_popup.userData.scrollbarPageDown.position.z = me._ht_info_popup.position.z + 0.05;
				me._ht_info_popup.userData.scrollbarPageDown.userData.stopPropagation = true;
				me._ht_info_popup.userData.scrollbarPageDown.userData.clickInvisible = true;
				me._ht_info_popup.userData.scrollbarPageDown.visible = false;
				me._ht_info_popup.add(me._ht_info_popup.userData.scrollbarPageDown);
				geometry = new THREE.PlaneGeometry(20 / 100.0, me._ht_info_popup.userData.height / 200.0, 5, 5 );
				geometry.name = 'ht_info_popup_scrollbarPageUpGeometry';
				material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
				material.name = 'ht_info_popup_scrollbarPageUpMaterial';
				me._ht_info_popup.userData.scrollbarPageUp = new THREE.Mesh( geometry, material );
				me._ht_info_popup.userData.scrollbarPageUp.name = 'ht_info_popup_scrollbarPageUp';
				me._ht_info_popup.userData.scrollbarPageUp.userData.onclick = function() {
					me._ht_info_popup.userData.scrollPosPercent += me._ht_info_popup.userData.pagePercent;
					me._ht_info_popup.userData.scrollPosPercent = Math.min(me._ht_info_popup.userData.scrollPosPercent, me._ht_info_popup.userData.maxScrollPercent);
					me._ht_info_popup.userData.ggTextureFromCanvas();
					me._ht_info_popup.userData.scrollbar.position.y -= (me._ht_info_popup.userData.height * me._ht_info_popup.userData.pagePercent) / 100.0;
					me._ht_info_popup.userData.scrollbar.position.y = Math.max(me._ht_info_popup.userData.scrollbar.position.y, me._ht_info_popup.userData.scrollbarYPosMax);
				}
				me._ht_info_popup.userData.scrollbarPageUp.position.x = me._ht_info_popup.userData.scrollbarXPos;
				me._ht_info_popup.userData.scrollbarPageUp.position.y = -me._ht_info_popup.userData.height / 400.0;
				me._ht_info_popup.userData.scrollbarPageUp.position.z = me._ht_info_popup.position.z + 0.05;
				me._ht_info_popup.userData.scrollbarPageUp.userData.stopPropagation = true;
				me._ht_info_popup.userData.scrollbarPageUp.userData.clickInvisible = true;
				me._ht_info_popup.userData.scrollbarPageUp.visible = false;
				me._ht_info_popup.add(me._ht_info_popup.userData.scrollbarPageUp);
				me._ht_info_popup.userData.hasScrollbar = true;
			} else {
				me._ht_info_popup.userData.hasScrollbar = false;
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
			me._ht_info_popup.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_info_popup.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_info_popup.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_info_popup.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_info_popup";
		me._ht_info_popup.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_popup.userData.ggUpdatePosition=function (useTransition) {
				me._ht_info_popup.userData.ggUpdateText(true);
		}
		me._ht_info_popup_bg.add(me._ht_info_popup);
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
			if (me._ht_info_popup_close.userData.svgGroupNormal) me._ht_info_popup_close.userData.setOpacityInState(me._ht_info_popup_close.userData.svgGroupNormal, v);
			if (me._ht_info_popup_close.userData.svgGroupOver) me._ht_info_popup_close.userData.setOpacityInState(me._ht_info_popup_close.userData.svgGroupOver, v);
			if (me._ht_info_popup_close.userData.svgGroupActive) me._ht_info_popup_close.userData.setOpacityInState(me._ht_info_popup_close.userData.svgGroupActive, v);
			me._ht_info_popup_close.visible = (v>0 && me._ht_info_popup_close.userData.visible);
		}
		el.translateX(2.85);
		el.translateY(2.05);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 40;
		el.userData.height = 40;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_info_popup_close';
		el.userData.x = 2.85;
		el.userData.y = 2.05;
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
			let vis = me._ht_info_popup_close.visible
			let parentEl = me._ht_info_popup_close.parent;
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
			me._ht_info_popup_close.userData.opacity = v;
			v = v * me._ht_info_popup_close.userData.parentOpacity;
			if (me._ht_info_popup_close.userData.setOpacityInternal) me._ht_info_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_popup_close.children.length; i++) {
				let child = me._ht_info_popup_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_info_popup_close.userData.parentOpacity = v;
			v = v * me._ht_info_popup_close.userData.opacity
			if (me._ht_info_popup_close.userData.setOpacityInternal) me._ht_info_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_info_popup_close.children.length; i++) {
				let child = me._ht_info_popup_close.children[i];
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
		me._ht_info_popup_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(40 / 100.0, 40 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_info_popup_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_info_popup_close_clickTargetMaterial';
		me._ht_info_popup_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_info_popup_close.userData.clickTarget.name = 'ht_info_popup_close_clickTarget';
		me._ht_info_popup_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_info_popup_close.userData.clickTarget.visible = false;
		me._ht_info_popup_close.add(me._ht_info_popup_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_info_popup_close.svg', me._ht_info_popup_close.userData.width / 100.0, me._ht_info_popup_close.userData.height / 100.0);
			me._ht_info_popup_close.add(group);
			me._ht_info_popup_close.userData.svgGroupNormal = group;
			me._ht_info_popup_close.userData.setOpacityInState(group, me._ht_info_popup_close.userData.opacity);
			player.repaint(3);
		})();
		(async() => {
			group = await player.loadSvg3D(basePath + 'images_vr/ht_info_popup_close__o.svg', me._ht_info_popup_close.userData.width / 100.0, me._ht_info_popup_close.userData.height / 100.0);
			group.visible = false;
			me._ht_info_popup_close.add(group);
			me._ht_info_popup_close.userData.svgGroupOver = group;
			me._ht_info_popup_close.userData.setOpacityInState(group, me._ht_info_popup_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_info_popup_close";
		me._ht_info_popup_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_info_popup_close.userData.onclick=function (e) {
			player.setVariableValue('open_info_hs', player.getVariableValue('open_info_hs').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_info_popup_close.userData.hasOwnClickAction = true;
		me._ht_info_popup_close.userData.onmouseenter=function (e) {
			me._ht_info_popup_close.userData.svgGroupNormal.visible = false;
			me._ht_info_popup_close.userData.svgGroupOver.visible = true;
			me.elementMouseOver['ht_info_popup_close']=true;
		}
		me._ht_info_popup_close.userData.onmouseleave=function (e) {
			me._ht_info_popup_close.userData.svgGroupNormal.visible = true;
			me._ht_info_popup_close.userData.svgGroupOver.visible = false;
			if (me._ht_info_popup_close.userData.svgGroupActive) me._ht_info_popup_close.userData.svgGroupActive.visible = false;
			me.elementMouseOver['ht_info_popup_close']=false;
		}
		me._ht_info_popup_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_info_popup_bg.add(me._ht_info_popup_close);
		me._ht_info.add(me._ht_info_popup_bg);
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
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
				((me.hotspot.customimage == "")) || 
				(((player.getVariableValue('open_info_hs') !== null) && (player.getVariableValue('open_info_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
			me._ht_info_customimage.visible=false;
			player.repaint();
			me._ht_info_customimage.userData.visible=false;
				}
				else {
			me._ht_info_customimage.visible=((!me._ht_info_customimage.material && Number(me._ht_info_customimage.userData.opacity>0)) || (me._ht_info_customimage.material && Number(me._ht_info_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_info_customimage.userData.visible=true;
				}
			}
		}
		me._ht_info_customimage.userData.onclick=function (e) {
			player.setVariableValue('open_info_hs', player.getVariableValue('open_info_hs') + "<"+me.hotspot.id+">");
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
		me._ht_info_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_bg.traverse((obj)=>{
				if (me._ht_info_bg.material) {
					me._ht_info_bg.material.transparent = (me._ht_info_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_info_bg']=false;
		me._ht_info_bg.logicBlock_scaling();
		me._ht_info_bg.logicBlock_visible();
		me._ht_info_bg.logicBlock_alpha();
		me._ht_info_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_icon.traverse((obj)=>{
				if (me._ht_info_icon.material) {
					me._ht_info_icon.material.transparent = (me._ht_info_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_info_title.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_title.traverse((obj)=>{
				if (me._ht_info_title.material) {
					me._ht_info_title.material.transparent = (me._ht_info_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_info_title.userData.ggUpdateText(true);
		me._ht_info_title.logicBlock_visible();
		me._ht_info_title.logicBlock_alpha();
		me._ht_info_title_gs.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_title_gs.traverse((obj)=>{
				if (me._ht_info_title_gs.material) {
					me._ht_info_title_gs.material.transparent = (me._ht_info_title_gs.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_info_title_gs.userData.ggUpdateText(true);
		me._ht_info_title_gs.logicBlock_visible();
		me._ht_info_title_gs.logicBlock_alpha();
		me._ht_info_popup_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_popup_bg.traverse((obj)=>{
				if (me._ht_info_popup_bg.material) {
					me._ht_info_popup_bg.material.transparent = (me._ht_info_popup_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_info_popup_bg.logicBlock_scaling();
		me._ht_info_popup_bg.logicBlock_alpha();
		me._ht_info_popup.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_popup.traverse((obj)=>{
				if (me._ht_info_popup.material) {
					me._ht_info_popup.material.transparent = (me._ht_info_popup.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_info_popup.userData.ggUpdateText(true);
		me._ht_info_popup_close.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_info_popup_close.traverse((obj)=>{
				if (me._ht_info_popup_close.material) {
					me._ht_info_popup_close.material.transparent = (me._ht_info_popup_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_info_popup_close']=false;
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
				me._ht_info_bg.logicBlock_visible();
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
					me._ht_info_bg.traverse((obj)=>{
						if (me._ht_info_bg.material) {
							me._ht_info_bg.material.transparent = (me._ht_info_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_bg.logicBlock_visible();
				me._ht_info_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_info_icon.traverse((obj)=>{
						if (me._ht_info_icon.material) {
							me._ht_info_icon.material.transparent = (me._ht_info_icon.userData.zIndexCurrent > 0);
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
				me._ht_info_title.logicBlock_visible();
					me._ht_info_title_gs.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_info_title_gs.traverse((obj)=>{
						if (me._ht_info_title_gs.material) {
							me._ht_info_title_gs.material.transparent = (me._ht_info_title_gs.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_title_gs.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_info_popup_bg.traverse((obj)=>{
						if (me._ht_info_popup_bg.material) {
							me._ht_info_popup_bg.material.transparent = (me._ht_info_popup_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_info_popup_bg.logicBlock_scaling();
				me._ht_info_popup_bg.logicBlock_alpha();
					me._ht_info_popup.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_info_popup.traverse((obj)=>{
						if (me._ht_info_popup.material) {
							me._ht_info_popup.material.transparent = (me._ht_info_popup.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_info_popup_close.traverse((obj)=>{
						if (me._ht_info_popup_close.material) {
							me._ht_info_popup_close.material.transparent = (me._ht_info_popup_close.userData.zIndexCurrent > 0);
							}
					});
				}
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
				me._ht_info_bg.logicBlock_visible();
				me._ht_info_bg.logicBlock_alpha();
				me._ht_info_popup_bg.logicBlock_scaling();
				me._ht_info_popup_bg.logicBlock_alpha();
				me._ht_info_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_open_image_hs=function() {
				me._ht_info_bg.logicBlock_alpha();
			};
			me.ggEvent_varchanged_open_info_hs=function() {
				me._ht_info_popup_bg.logicBlock_scaling();
				me._ht_info_popup_bg.logicBlock_alpha();
				me._ht_info_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_info;
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
		el.userData.x = -1.17;
		el.userData.y = 2.1;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_image_bg_material';
			el.material = material;
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
		el.name = 'ht_image_bg';
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
		el.visible = false;
		el.userData.permeable = false;
		el.userData.visible = false;
		el.userData.opacity = 1.00;
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
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
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
		me._ht_image_bg.userData.backgroundColorAlpha = 0.588235;
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
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
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
				((me.elementMouseOver['ht_image_bg'] == true))
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
					me._ht_image_bg.userData.transitionValue_scale = {x: 1.2, y: 1.2, z: 1.0};
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
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
		me._ht_image_bg.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage == ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_bg.ggCurrentLogicStateVisible == 0) {
			me._ht_image_bg.visible=((!me._ht_image_bg.material && Number(me._ht_image_bg.userData.opacity>0)) || (me._ht_image_bg.material && Number(me._ht_image_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_bg.userData.visible=true;
				}
				else {
			me._ht_image_bg.visible=false;
			player.repaint();
			me._ht_image_bg.userData.visible=false;
				}
			}
		}
		me._ht_image_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_image_hs') !== null) && (player.getVariableValue('open_image_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 200;
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
		me._ht_image_bg.userData.onclick=function (e) {
			player.setVariableValue('open_image_hs', player.getVariableValue('open_image_hs') + "<"+me.hotspot.id+">");
		}
		me._ht_image_bg.userData.hasOwnClickAction = true;
		me._ht_image_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_image_bg']=true;
			me._ht_image_title.logicBlock_alpha();
			me._ht_image_title_gs.logicBlock_alpha();
			me._ht_image_bg.logicBlock_scaling();
		}
		me._ht_image_bg.userData.ontouchend=function (e) {
			me._ht_image_bg.logicBlock_scaling();
		}
		me._ht_image_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_image_bg']=false;
			me._ht_image_title.logicBlock_alpha();
			me._ht_image_title_gs.logicBlock_alpha();
			me._ht_image_bg.logicBlock_scaling();
		}
		me._ht_image_bg.userData.ggUpdatePosition=function (useTransition) {
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
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 36;
		el.userData.height = 36;
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
		clickTargetGeometry = new THREE.PlaneGeometry(36 / 100.0, 36 / 100.0, 5, 5 );
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
		me._ht_image_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_image_bg.add(me._ht_image_icon);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_image_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_title';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
		el.userData.isVisible = function() {
			let vis = me._ht_image_title.visible
			let parentEl = me._ht_image_title.parent;
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
			me._ht_image_title.userData.opacity = v;
			v = v * me._ht_image_title.userData.parentOpacity;
			if (me._ht_image_title.userData.setOpacityInternal) me._ht_image_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_title.children.length; i++) {
				let child = me._ht_image_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_title.userData.parentOpacity = v;
			v = v * me._ht_image_title.userData.opacity
			if (me._ht_image_title.userData.setOpacityInternal) me._ht_image_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_title.children.length; i++) {
				let child = me._ht_image_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = true;
		el.userData.permeable = true;
		el.userData.visible = true;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_title = el;
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
			let el = me._ht_image_title;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_title);
			if (skin.rectHasRoundedCorners(me._ht_image_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_image_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_image_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_image_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_image_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_image_title_geometry';
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
				geometry.name = 'ht_image_title_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_image_title.userData.backgroundColorAlpha = 1;
		me._ht_image_title.userData.borderColorAlpha = 1;
		me._ht_image_title.userData.setOpacityInternal = function(v) {
			me._ht_image_title.material.opacity = v;
			if (me._ht_image_title.userData.hasScrollbar) {
				me._ht_image_title.userData.scrollbar.material.opacity = v;
				me._ht_image_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_image_title.userData.ggSubElement) {
				me._ht_image_title.userData.ggSubElement.material.opacity = v
				me._ht_image_title.userData.ggSubElement.visible = (v>0 && me._ht_image_title.userData.visible);
			}
			me._ht_image_title.visible = (v>0 && me._ht_image_title.userData.visible);
		}
		me._ht_image_title.userData.setBackgroundColor = function(v) {
			me._ht_image_title.material.color = v;
		}
		me._ht_image_title.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_title.userData.backgroundColorAlpha = v;
			me._ht_image_title.userData.setOpacity(me._ht_image_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		el.userData.backgroundColor = player.getTHREESkinColor('#ffffff');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_image_title;
			var canv = me._ht_image_title.userData.textCanvas;
			var ctx = me._ht_image_title.userData.textCanvasContext;
			var tmpCanv = me._ht_image_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_image_title.userData.scrollPosPercent ? tmpCanv.height * me._ht_image_title.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_image_title.userData.boxWidthCanv / 100.0;
		height = me._ht_image_title.userData.boxHeightCanv / 100.0;
		me._ht_image_title.userData.width = me._ht_image_title.userData.boxWidthCanv;
		me._ht_image_title.userData.height = me._ht_image_title.userData.boxHeightCanv;
		me._ht_image_title.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_image_title, 0, -20);
		me._ht_image_title.position.x = newPos.x;
		me._ht_image_title.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_image_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_image_title.material.map) {
				me._ht_image_title.material.map.dispose();
			}
			me._ht_image_title.material.map = textTexture;
			me._ht_image_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_image_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_image_title, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 0px; overflow: hidden;' + '; color: ' + me._ht_image_title.userData.textColor + ' !important;', false, true, false);
			me._ht_image_title.userData.hasScrollbar = false;
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
			me._ht_image_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_image_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_image_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_image_title";
		me._ht_image_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_title.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_title.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_title.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_title.ggCurrentLogicStateVisible == 0) {
			me._ht_image_title.visible=false;
			player.repaint();
			me._ht_image_title.userData.visible=false;
				}
				else {
			me._ht_image_title.visible=((!me._ht_image_title.material && Number(me._ht_image_title.userData.opacity>0)) || (me._ht_image_title.material && Number(me._ht_image_title.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_title.userData.visible=true;
				}
			}
		}
		me._ht_image_title.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_image_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_title.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_title.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_title.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_title.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_title.userData.transitions.length; i++) {
						if (me._ht_image_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_title.userData.transitions[i].interval);
							me._ht_image_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_title.material ? me._ht_image_title.material.opacity : me._ht_image_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_title.userData.transitions.splice(me._ht_image_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_title.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_image_title.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_title.userData.transitions.length; i++) {
						if (me._ht_image_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_title.userData.transitions[i].interval);
							me._ht_image_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_title.material ? me._ht_image_title.material.opacity : me._ht_image_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_title.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_title.userData.transitions.splice(me._ht_image_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_title.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_image_title.userData.ggUpdatePosition=function (useTransition) {
				me._ht_image_title.userData.ggUpdateText(true);
		}
		me._ht_image_bg.add(me._ht_image_title);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_image_title_gs_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.325);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 100;
		el.userData.height = 20;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_title_gs';
		el.userData.x = 0;
		el.userData.y = -0.325;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_image_title_gs.visible
			let parentEl = me._ht_image_title_gs.parent;
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
			me._ht_image_title_gs.userData.opacity = v;
			v = v * me._ht_image_title_gs.userData.parentOpacity;
			if (me._ht_image_title_gs.userData.setOpacityInternal) me._ht_image_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_title_gs.children.length; i++) {
				let child = me._ht_image_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_title_gs.userData.parentOpacity = v;
			v = v * me._ht_image_title_gs.userData.opacity
			if (me._ht_image_title_gs.userData.setOpacityInternal) me._ht_image_title_gs.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_title_gs.children.length; i++) {
				let child = me._ht_image_title_gs.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.visible = false;
		el.userData.permeable = true;
		el.userData.visible = false;
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._ht_image_title_gs = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 6;
		el.userData.borderRadius.default.topRight = 6;
		el.userData.borderRadius.default.bottomRight = 6;
		el.userData.borderRadius.default.bottomLeft = 6;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_image_title_gs;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_title_gs);
			if (skin.rectHasRoundedCorners(me._ht_image_title_gs)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_image_title_gs.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_image_title_gs.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_image_title_gs.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_image_title_gs.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_image_title_gs_geometry';
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
				geometry.name = 'ht_image_title_gs_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_image_title_gs.userData.backgroundColorAlpha = 1;
		me._ht_image_title_gs.userData.borderColorAlpha = 1;
		me._ht_image_title_gs.userData.setOpacityInternal = function(v) {
			me._ht_image_title_gs.material.opacity = v;
			if (me._ht_image_title_gs.userData.hasScrollbar) {
				me._ht_image_title_gs.userData.scrollbar.material.opacity = v;
				me._ht_image_title_gs.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_image_title_gs.userData.ggSubElement) {
				me._ht_image_title_gs.userData.ggSubElement.material.opacity = v
				me._ht_image_title_gs.userData.ggSubElement.visible = (v>0 && me._ht_image_title_gs.userData.visible);
			}
			me._ht_image_title_gs.visible = (v>0 && me._ht_image_title_gs.userData.visible);
		}
		me._ht_image_title_gs.userData.setBackgroundColor = function(v) {
			me._ht_image_title_gs.material.color = v;
		}
		me._ht_image_title_gs.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_title_gs.userData.backgroundColorAlpha = v;
			me._ht_image_title_gs.userData.setOpacity(me._ht_image_title_gs.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 6, 6, 6, 6);
		el.userData.backgroundColor = player.getTHREESkinColor('#4a4a4a');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 40;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_image_title_gs;
			var canv = me._ht_image_title_gs.userData.textCanvas;
			var ctx = me._ht_image_title_gs.userData.textCanvasContext;
			var tmpCanv = me._ht_image_title_gs.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_image_title_gs.userData.backgroundColor.r * 255 + ', ' + me._ht_image_title_gs.userData.backgroundColor.g * 255 + ', ' + me._ht_image_title_gs.userData.backgroundColor.b * 255 + ', ' + me._ht_image_title_gs.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, ( me._ht_image_title_gs.userData.scrollPosPercent ? tmpCanv.height * me._ht_image_title_gs.userData.scrollPosPercent : 0), canv.width, canv.height, 0, 0, canv.width, canv.height);
			}
		width = me._ht_image_title_gs.userData.boxWidthCanv / 100.0;
		height = me._ht_image_title_gs.userData.boxHeightCanv / 100.0;
		me._ht_image_title_gs.userData.width = me._ht_image_title_gs.userData.boxWidthCanv;
		me._ht_image_title_gs.userData.height = me._ht_image_title_gs.userData.boxHeightCanv;
		me._ht_image_title_gs.userData.createGeometry();
		var newPos = skin.getElementVrPosition(me._ht_image_title_gs, 0, -20);
		me._ht_image_title_gs.position.x = newPos.x;
		me._ht_image_title_gs.position.y = newPos.y;
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_image_title_gs_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_image_title_gs.material.map) {
				me._ht_image_title_gs.material.map.dispose();
			}
			me._ht_image_title_gs.material.map = textTexture;
			me._ht_image_title_gs.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_image_title_gs, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_image_title_gs, 'box-sizing: border-box; width: auto; height: auto; font-size: 18px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre; padding: 1px; overflow: hidden;' + '; color: ' + me._ht_image_title_gs.userData.textColor + ' !important;', false, true, false);
			me._ht_image_title_gs.userData.hasScrollbar = false;
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
			me._ht_image_title_gs.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_title_gs.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_image_title_gs.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_image_title_gs.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_image_title_gs";
		me._ht_image_title_gs.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_title_gs.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player.get3dModelType() == 2))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_image_title_gs.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_image_title_gs.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_image_title_gs.ggCurrentLogicStateVisible == 0) {
			me._ht_image_title_gs.visible=((!me._ht_image_title_gs.material && Number(me._ht_image_title_gs.userData.opacity>0)) || (me._ht_image_title_gs.material && Number(me._ht_image_title_gs.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_title_gs.userData.visible=true;
				}
				else {
			me._ht_image_title_gs.visible=false;
			player.repaint();
			me._ht_image_title_gs.userData.visible=false;
				}
			}
		}
		me._ht_image_title_gs.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_image_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_title_gs.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_title_gs.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_title_gs.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_title_gs.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_title_gs.userData.transitions.length; i++) {
						if (me._ht_image_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_title_gs.userData.transitions[i].interval);
							me._ht_image_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_title_gs.material ? me._ht_image_title_gs.material.opacity : me._ht_image_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_title_gs.userData.transitions.splice(me._ht_image_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_title_gs.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_image_title_gs.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_title_gs.userData.transitions.length; i++) {
						if (me._ht_image_title_gs.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_title_gs.userData.transitions[i].interval);
							me._ht_image_title_gs.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_title_gs.material ? me._ht_image_title_gs.material.opacity : me._ht_image_title_gs.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_title_gs.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_title_gs.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_title_gs.userData.transitions.splice(me._ht_image_title_gs.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_title_gs.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_image_title_gs.userData.ggUpdatePosition=function (useTransition) {
				me._ht_image_title_gs.userData.ggUpdateText(true);
		}
		me._ht_image_bg.add(me._ht_image_title_gs);
		me._ht_image.add(me._ht_image_bg);
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_image_popup_bg_material';
			el.material = material;
		el.translateX(0);
		el.translateY(0);
		el.scale.set(0.10, 0.10, 1.0);
		el.userData.width = 660;
		el.userData.height = 480;
		el.userData.scale = {x: 0.10, y: 0.10, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_popup_bg';
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
			let vis = me._ht_image_popup_bg.visible
			let parentEl = me._ht_image_popup_bg.parent;
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
			me._ht_image_popup_bg.userData.opacity = v;
			v = v * me._ht_image_popup_bg.userData.parentOpacity;
			if (me._ht_image_popup_bg.userData.setOpacityInternal) me._ht_image_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_popup_bg.children.length; i++) {
				let child = me._ht_image_popup_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_popup_bg.userData.parentOpacity = v;
			v = v * me._ht_image_popup_bg.userData.opacity
			if (me._ht_image_popup_bg.userData.setOpacityInternal) me._ht_image_popup_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_popup_bg.children.length; i++) {
				let child = me._ht_image_popup_bg.children[i];
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
		me._ht_image_popup_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 30;
		el.userData.borderRadius.default.topRight = 30;
		el.userData.borderRadius.default.bottomRight = 30;
		el.userData.borderRadius.default.bottomLeft = 30;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_image_popup_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_popup_bg);
			if (skin.rectHasRoundedCorners(me._ht_image_popup_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_image_popup_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_image_popup_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_image_popup_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_image_popup_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_image_popup_bg_geometry';
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
				geometry.name = 'ht_image_popup_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_image_popup_bg.userData.backgroundColorAlpha = 0.666667;
		me._ht_image_popup_bg.userData.borderColorAlpha = 1;
		me._ht_image_popup_bg.userData.setOpacityInternal = function(v) {
			me._ht_image_popup_bg.material.opacity = v * me._ht_image_popup_bg.userData.backgroundColorAlpha;
			if (me._ht_image_popup_bg.userData.ggSubElement) {
				me._ht_image_popup_bg.userData.ggSubElement.material.opacity = v
				me._ht_image_popup_bg.userData.ggSubElement.visible = (v>0 && me._ht_image_popup_bg.userData.visible);
			}
			me._ht_image_popup_bg.visible = (v>0 && me._ht_image_popup_bg.userData.visible);
		}
		me._ht_image_popup_bg.userData.setBackgroundColor = function(v) {
			me._ht_image_popup_bg.material.color = v;
		}
		me._ht_image_popup_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_image_popup_bg.userData.backgroundColorAlpha = v;
			me._ht_image_popup_bg.userData.setOpacity(me._ht_image_popup_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 30, 30, 30, 30);
		el.userData.ggId="ht_image_popup_bg";
		me._ht_image_popup_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_popup_bg.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				(((player.getVariableValue('open_image_hs') !== null) && (player.getVariableValue('open_image_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_image_popup_bg.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_image_popup_bg.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_image_popup_bg.ggCurrentLogicStateScaling == 0) {
					me._ht_image_popup_bg.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_image_popup_bg.userData.transitions.length; i++) {
						if (me._ht_image_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_popup_bg.userData.transitions[i].interval);
							me._ht_image_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_image_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_popup_bg.position.x = (me._ht_image_popup_bg.position.x - me._ht_image_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_image_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_image_popup_bg.position.y = (me._ht_image_popup_bg.position.y - me._ht_image_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_image_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_popup_bg.userData.transitions.splice(me._ht_image_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_popup_bg.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_image_popup_bg.userData.transitionValue_scale = {x: 0.1, y: 0.1, z: 1.0};
					for (var i = 0; i < me._ht_image_popup_bg.userData.transitions.length; i++) {
						if (me._ht_image_popup_bg.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_image_popup_bg.userData.transitions[i].interval);
							me._ht_image_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_image_popup_bg.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_popup_bg.scale.set(transition_scale.startScale.x + (me._ht_image_popup_bg.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_image_popup_bg.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_image_popup_bg.position.x = (me._ht_image_popup_bg.position.x - me._ht_image_popup_bg.userData.curScaleOffX) + scaleOffX;
							me._ht_image_popup_bg.userData.curScaleOffX = scaleOffX;
							me._ht_image_popup_bg.position.y = (me._ht_image_popup_bg.position.y - me._ht_image_popup_bg.userData.curScaleOffY) + scaleOffY;
							me._ht_image_popup_bg.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_image_popup_bg.userData.transitions.splice(me._ht_image_popup_bg.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_image_popup_bg.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_image_popup_bg.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				(((player.getVariableValue('open_image_hs') !== null) && (player.getVariableValue('open_image_hs')).indexOf("<"+me.hotspot.id+">") != -1))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_image_popup_bg.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_image_popup_bg.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_image_popup_bg.ggCurrentLogicStateAlpha == 0) {
					me._ht_image_popup_bg.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_image_popup_bg.userData.transitions.length; i++) {
						if (me._ht_image_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_popup_bg.userData.transitions[i].interval);
							me._ht_image_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_popup_bg.material ? me._ht_image_popup_bg.material.opacity : me._ht_image_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_popup_bg.userData.transitions.splice(me._ht_image_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_image_popup_bg.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_image_popup_bg.userData.transitions.length; i++) {
						if (me._ht_image_popup_bg.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_image_popup_bg.userData.transitions[i].interval);
							me._ht_image_popup_bg.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_image_popup_bg.material ? me._ht_image_popup_bg.material.opacity : me._ht_image_popup_bg.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_image_popup_bg.userData.setOpacity(transition_alpha.startAlpha + (me._ht_image_popup_bg.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_image_popup_bg.userData.transitions.splice(me._ht_image_popup_bg.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_image_popup_bg.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_image_popup_bg.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Group();
		el.translateX(0);
		el.translateY(-0.2);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 600;
		el.userData.height = 400;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 20;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 20;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 20;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 20;
		el.name = 'ht_image_popup';
		el.userData.x = 0;
		el.userData.y = -0.2;
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
			let vis = me._ht_image_popup.visible
			let parentEl = me._ht_image_popup.parent;
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
			me._ht_image_popup.userData.opacity = v;
			v = v * me._ht_image_popup.userData.parentOpacity;
			if (me._ht_image_popup.userData.setOpacityInternal) me._ht_image_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_popup.children.length; i++) {
				let child = me._ht_image_popup.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_popup.userData.parentOpacity = v;
			v = v * me._ht_image_popup.userData.opacity
			if (me._ht_image_popup.userData.setOpacityInternal) me._ht_image_popup.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_popup.children.length; i++) {
				let child = me._ht_image_popup.children[i];
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
		me._ht_image_popup = el;
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
			let el = me._ht_image_popup;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_image_popup);
		}
		me._ht_image_popup.userData.backgroundColorAlpha = 1;
		me._ht_image_popup.userData.borderColorAlpha = 1;
		me._ht_image_popup.userData.setOpacityInternal = function(v) {
			if (me._ht_image_popup.userData.ggSubElement) {
				me._ht_image_popup.userData.ggSubElement.material.opacity = v
				me._ht_image_popup.userData.ggSubElement.visible = (v>0 && me._ht_image_popup.userData.visible);
			}
			me._ht_image_popup.visible = (v>0 && me._ht_image_popup.userData.visible);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 0, 0);
		currentWidth = 600;
		currentHeight = 400;
		var img = {};
		let width = currentWidth / 100.0;
		let height = currentHeight / 100.0;
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_image_popup.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_image_popup.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_image_popup.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_image_popup.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_image_popup_geometry';
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
		img.geometry = geometry;
		loader = new THREE.TextureLoader();
		el.userData.ggSetUrl = function(extUrl) {
			loader.load(extUrl,
				function (texture) {
				texture.colorSpace = player.getVRTextureColorSpace();
				let tmpDepthTest = true;
				if (me._ht_image_popup.userData.ggSubElement.material) {
					tmpDepthTest = me._ht_image_popup.userData.ggSubElement.material.depthTest;
				}
				var loadedMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, depthTest: tmpDepthTest, depthWrite: tmpDepthTest });
				loadedMaterial.name = 'ht_image_popup_subElementMaterial';
				me._ht_image_popup.userData.ggSubElement.material = loadedMaterial;
				me._ht_image_popup.userData.ggUpdatePosition();
				me._ht_image_popup.userData.ggText = extUrl;
				me._ht_image_popup.userData.setOpacity(me._ht_image_popup.userData.opacity);
			});
		};
		player.addListener('changenode', function() {
		});
		var extUrl=basePath + ""+player._(me.hotspot.url)+"";
		el.userData.ggSetUrl(extUrl);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, transparent: true } );
		material.name = 'ht_image_popup_subElementMaterial';
		el.userData.ggSubElement = new THREE.Mesh( img.geometry, material );
		el.userData.ggSubElement.name = 'ht_image_popup_subElement';
		el.userData.ggSubElement.position.z = el.position.z + 0.005;
		el.add(el.userData.ggSubElement);
		el.userData.clientWidth = 600;
		el.userData.clientHeight = 400;
		el.userData.ggId="ht_image_popup";
		me._ht_image_popup.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_popup.userData.ggUpdatePosition=function (useTransition) {
			var parentWidth = me._ht_image_popup.userData.clientWidth;
			var parentHeight = me._ht_image_popup.userData.clientHeight;
			var img = me._ht_image_popup.userData.ggSubElement;
			if (!img.material || !img.material.map) return;
			var imgWidth = img.material.map.image.naturalWidth;
			var imgHeight = img.material.map.image.naturalHeight;
			var aspectRatioDiv = parentWidth / parentHeight;
			var aspectRatioImg = imgWidth / imgHeight;
			var currentWidth, currentHeight;
			img.geometry.dispose();
			if (aspectRatioDiv > aspectRatioImg) {
				currentHeight = parentHeight;
				currentWidth = parentHeight * aspectRatioImg;
			let width = currentWidth / 100.0;
			let height = currentHeight / 100.0;
			roundedRectShape = new THREE.Shape();
			let borderRadiusTL = me._ht_image_popup.userData.borderRadiusInnerShape.topLeft / 100.0;
			let borderRadiusTR = me._ht_image_popup.userData.borderRadiusInnerShape.topRight / 100.0;
			let borderRadiusBR = me._ht_image_popup.userData.borderRadiusInnerShape.bottomRight / 100.0;
			let borderRadiusBL = me._ht_image_popup.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
			geometry.name = 'ht_image_popup_geometry';
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
			img.geometry = geometry;
			} else {
				currentWidth = parentWidth;
				currentHeight = parentWidth / aspectRatioImg;
			let width = currentWidth / 100.0;
			let height = currentHeight / 100.0;
			roundedRectShape = new THREE.Shape();
			let borderRadiusTL = me._ht_image_popup.userData.borderRadiusInnerShape.topLeft / 100.0;
			let borderRadiusTR = me._ht_image_popup.userData.borderRadiusInnerShape.topRight / 100.0;
			let borderRadiusBR = me._ht_image_popup.userData.borderRadiusInnerShape.bottomRight / 100.0;
			let borderRadiusBL = me._ht_image_popup.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
			geometry.name = 'ht_image_popup_geometry';
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
			img.geometry = geometry;
			};
		}
		me._ht_image_popup_bg.add(me._ht_image_popup);
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
			if (me._ht_image_popup_close.userData.svgGroupNormal) me._ht_image_popup_close.userData.setOpacityInState(me._ht_image_popup_close.userData.svgGroupNormal, v);
			if (me._ht_image_popup_close.userData.svgGroupOver) me._ht_image_popup_close.userData.setOpacityInState(me._ht_image_popup_close.userData.svgGroupOver, v);
			if (me._ht_image_popup_close.userData.svgGroupActive) me._ht_image_popup_close.userData.setOpacityInState(me._ht_image_popup_close.userData.svgGroupActive, v);
			me._ht_image_popup_close.visible = (v>0 && me._ht_image_popup_close.userData.visible);
		}
		el.translateX(2.85);
		el.translateY(2.05);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 40;
		el.userData.height = 40;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_image_popup_close';
		el.userData.x = 2.85;
		el.userData.y = 2.05;
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
			let vis = me._ht_image_popup_close.visible
			let parentEl = me._ht_image_popup_close.parent;
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
			me._ht_image_popup_close.userData.opacity = v;
			v = v * me._ht_image_popup_close.userData.parentOpacity;
			if (me._ht_image_popup_close.userData.setOpacityInternal) me._ht_image_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_popup_close.children.length; i++) {
				let child = me._ht_image_popup_close.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_image_popup_close.userData.parentOpacity = v;
			v = v * me._ht_image_popup_close.userData.opacity
			if (me._ht_image_popup_close.userData.setOpacityInternal) me._ht_image_popup_close.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_image_popup_close.children.length; i++) {
				let child = me._ht_image_popup_close.children[i];
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
		me._ht_image_popup_close = el;
		clickTargetGeometry = new THREE.PlaneGeometry(40 / 100.0, 40 / 100.0, 5, 5 );
		clickTargetGeometry.name = 'ht_image_popup_close_clickTargetGeometry';
		clickTargetMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, transparent: true } );
		clickTargetMaterial.name = 'ht_image_popup_close_clickTargetMaterial';
		me._ht_image_popup_close.userData.clickTarget = new THREE.Mesh( clickTargetGeometry, clickTargetMaterial );
		me._ht_image_popup_close.userData.clickTarget.name = 'ht_image_popup_close_clickTarget';
		me._ht_image_popup_close.userData.clickTarget.userData.clickInvisible = true;
		me._ht_image_popup_close.userData.clickTarget.visible = false;
		me._ht_image_popup_close.add(me._ht_image_popup_close.userData.clickTarget);
		(async() => {
			let group = await player.loadSvg3D(basePath + 'images_vr/ht_image_popup_close.svg', me._ht_image_popup_close.userData.width / 100.0, me._ht_image_popup_close.userData.height / 100.0);
			me._ht_image_popup_close.add(group);
			me._ht_image_popup_close.userData.svgGroupNormal = group;
			me._ht_image_popup_close.userData.setOpacityInState(group, me._ht_image_popup_close.userData.opacity);
			player.repaint(3);
		})();
		(async() => {
			group = await player.loadSvg3D(basePath + 'images_vr/ht_image_popup_close__o.svg', me._ht_image_popup_close.userData.width / 100.0, me._ht_image_popup_close.userData.height / 100.0);
			group.visible = false;
			me._ht_image_popup_close.add(group);
			me._ht_image_popup_close.userData.svgGroupOver = group;
			me._ht_image_popup_close.userData.setOpacityInState(group, me._ht_image_popup_close.userData.opacity);
			player.repaint(3);
		})();
		el.userData.createGeometry = function() {};
		el.userData.ggId="ht_image_popup_close";
		me._ht_image_popup_close.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_image_popup_close.userData.onclick=function (e) {
			player.setVariableValue('open_image_hs', player.getVariableValue('open_image_hs').replace("<"+me.hotspot.id+">", ''));
		}
		me._ht_image_popup_close.userData.hasOwnClickAction = true;
		me._ht_image_popup_close.userData.onmouseenter=function (e) {
			me._ht_image_popup_close.userData.svgGroupNormal.visible = false;
			me._ht_image_popup_close.userData.svgGroupOver.visible = true;
			me.elementMouseOver['ht_image_popup_close']=true;
		}
		me._ht_image_popup_close.userData.onmouseleave=function (e) {
			me._ht_image_popup_close.userData.svgGroupNormal.visible = true;
			me._ht_image_popup_close.userData.svgGroupOver.visible = false;
			if (me._ht_image_popup_close.userData.svgGroupActive) me._ht_image_popup_close.userData.svgGroupActive.visible = false;
			me.elementMouseOver['ht_image_popup_close']=false;
		}
		me._ht_image_popup_close.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_image_popup_bg.add(me._ht_image_popup_close);
		me._ht_image.add(me._ht_image_popup_bg);
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
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
				((me.hotspot.customimage == "")) || 
				(((player.getVariableValue('open_image_hs') !== null) && (player.getVariableValue('open_image_hs')).indexOf("<"+me.hotspot.id+">") != -1))
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
			me._ht_image_customimage.visible=false;
			player.repaint();
			me._ht_image_customimage.userData.visible=false;
				}
				else {
			me._ht_image_customimage.visible=((!me._ht_image_customimage.material && Number(me._ht_image_customimage.userData.opacity>0)) || (me._ht_image_customimage.material && Number(me._ht_image_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_image_customimage.userData.visible=true;
				}
			}
		}
		me._ht_image_customimage.userData.onclick=function (e) {
			player.setVariableValue('open_image_hs', player.getVariableValue('open_image_hs') + "<"+me.hotspot.id+">");
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
		me._ht_image_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_bg.traverse((obj)=>{
				if (me._ht_image_bg.material) {
					me._ht_image_bg.material.transparent = (me._ht_image_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_image_bg']=false;
		me._ht_image_bg.logicBlock_scaling();
		me._ht_image_bg.logicBlock_visible();
		me._ht_image_bg.logicBlock_alpha();
		me._ht_image_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_icon.traverse((obj)=>{
				if (me._ht_image_icon.material) {
					me._ht_image_icon.material.transparent = (me._ht_image_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_image_title.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_title.traverse((obj)=>{
				if (me._ht_image_title.material) {
					me._ht_image_title.material.transparent = (me._ht_image_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_image_title.userData.ggUpdateText(true);
		me._ht_image_title.logicBlock_visible();
		me._ht_image_title.logicBlock_alpha();
		me._ht_image_title_gs.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_title_gs.traverse((obj)=>{
				if (me._ht_image_title_gs.material) {
					me._ht_image_title_gs.material.transparent = (me._ht_image_title_gs.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_image_title_gs.userData.ggUpdateText(true);
		me._ht_image_title_gs.logicBlock_visible();
		me._ht_image_title_gs.logicBlock_alpha();
		me._ht_image_popup_bg.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_popup_bg.traverse((obj)=>{
				if (me._ht_image_popup_bg.material) {
					me._ht_image_popup_bg.material.transparent = (me._ht_image_popup_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_image_popup_bg.logicBlock_scaling();
		me._ht_image_popup_bg.logicBlock_alpha();
		me._ht_image_popup.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_popup.traverse((obj)=>{
				if (me._ht_image_popup.material) {
					me._ht_image_popup.material.transparent = (me._ht_image_popup.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_image_popup_close.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_image_popup_close.traverse((obj)=>{
				if (me._ht_image_popup_close.material) {
					me._ht_image_popup_close.material.transparent = (me._ht_image_popup_close.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_image_popup_close']=false;
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
				me._ht_image_bg.logicBlock_visible();
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
					me._ht_image_bg.traverse((obj)=>{
						if (me._ht_image_bg.material) {
							me._ht_image_bg.material.transparent = (me._ht_image_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_bg.logicBlock_visible();
				me._ht_image_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_image_icon.traverse((obj)=>{
						if (me._ht_image_icon.material) {
							me._ht_image_icon.material.transparent = (me._ht_image_icon.userData.zIndexCurrent > 0);
							}
					});
				}
					me._ht_image_title.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_image_title.traverse((obj)=>{
						if (me._ht_image_title.material) {
							me._ht_image_title.material.transparent = (me._ht_image_title.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_title.logicBlock_visible();
					me._ht_image_title_gs.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_image_title_gs.traverse((obj)=>{
						if (me._ht_image_title_gs.material) {
							me._ht_image_title_gs.material.transparent = (me._ht_image_title_gs.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_title_gs.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_image_popup_bg.traverse((obj)=>{
						if (me._ht_image_popup_bg.material) {
							me._ht_image_popup_bg.material.transparent = (me._ht_image_popup_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_image_popup_bg.logicBlock_scaling();
				me._ht_image_popup_bg.logicBlock_alpha();
				if (player.get3dModelType() == 2) {
					me._ht_image_popup.traverse((obj)=>{
						if (me._ht_image_popup.material) {
							me._ht_image_popup.material.transparent = (me._ht_image_popup.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_image_popup_close.traverse((obj)=>{
						if (me._ht_image_popup_close.material) {
							me._ht_image_popup_close.material.transparent = (me._ht_image_popup_close.userData.zIndexCurrent > 0);
							}
					});
				}
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
				me._ht_image_bg.logicBlock_visible();
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_popup_bg.logicBlock_scaling();
				me._ht_image_popup_bg.logicBlock_alpha();
				me._ht_image_customimage.logicBlock_visible();
			};
			me.ggEvent_varchanged_open_image_hs=function() {
				me._ht_image_bg.logicBlock_alpha();
				me._ht_image_popup_bg.logicBlock_scaling();
				me._ht_image_popup_bg.logicBlock_alpha();
				me._ht_image_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_image;
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
		el.userData.x = -3.06;
		el.userData.y = 2.11;
		el.translateZ(0.030);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.030;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 0;
		el.userData.vanchor = 0;
		el.renderOrder = 3;
		el.userData.renderOrder = 3;
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
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( { color: player.getTHREESkinColor('#4a4a4a'), side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || false) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_node_bg_material';
			el.material = material;
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
		el.name = 'ht_node_bg';
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
			let vis = me._ht_node_bg.visible
			let parentEl = me._ht_node_bg.parent;
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
			me._ht_node_bg.userData.opacity = v;
			v = v * me._ht_node_bg.userData.parentOpacity;
			if (me._ht_node_bg.userData.setOpacityInternal) me._ht_node_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_bg.children.length; i++) {
				let child = me._ht_node_bg.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_bg.userData.parentOpacity = v;
			v = v * me._ht_node_bg.userData.opacity
			if (me._ht_node_bg.userData.setOpacityInternal) me._ht_node_bg.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_bg.children.length; i++) {
				let child = me._ht_node_bg.children[i];
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
		me._ht_node_bg = el;
		el.userData.borderWidth = {};
		el.userData.borderWidth.default = {};
		el.userData.borderWidth.default.top = 0;
		el.userData.borderWidth.default.right = 0;
		el.userData.borderWidth.default.bottom = 0;
		el.userData.borderWidth.default.left = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadius.default = {};
		el.userData.borderRadius.default.topLeft = 12;
		el.userData.borderRadius.default.topRight = 12;
		el.userData.borderRadius.default.bottomRight = 12;
		el.userData.borderRadius.default.bottomLeft = 12;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_node_bg;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_node_bg);
			if (skin.rectHasRoundedCorners(me._ht_node_bg)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_node_bg.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_node_bg.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_node_bg.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_node_bg.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_node_bg_geometry';
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
				geometry.name = 'ht_node_bg_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_node_bg.userData.backgroundColorAlpha = 0.588235;
		me._ht_node_bg.userData.borderColorAlpha = 1;
		me._ht_node_bg.userData.setOpacityInternal = function(v) {
			me._ht_node_bg.material.opacity = v * me._ht_node_bg.userData.backgroundColorAlpha;
			if (me._ht_node_bg.userData.ggSubElement) {
				me._ht_node_bg.userData.ggSubElement.material.opacity = v
				me._ht_node_bg.userData.ggSubElement.visible = (v>0 && me._ht_node_bg.userData.visible);
			}
			me._ht_node_bg.visible = (v>0 && me._ht_node_bg.userData.visible);
		}
		me._ht_node_bg.userData.setBackgroundColor = function(v) {
			me._ht_node_bg.material.color = v;
		}
		me._ht_node_bg.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_bg.userData.backgroundColorAlpha = v;
			me._ht_node_bg.userData.setOpacity(me._ht_node_bg.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 12, 12, 12, 12);
		el.userData.ggId="ht_node_bg";
		me._ht_node_bg.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me.ggNodeId;
		}
		me._ht_node_bg.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((me.hotspot.customimage == ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_bg.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_bg.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_bg.ggCurrentLogicStateVisible == 0) {
			me._ht_node_bg.visible=((!me._ht_node_bg.material && Number(me._ht_node_bg.userData.opacity>0)) || (me._ht_node_bg.material && Number(me._ht_node_bg.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_node_bg.userData.visible=true;
				}
				else {
			me._ht_node_bg.visible=false;
			player.repaint();
			me._ht_node_bg.userData.visible=false;
				}
			}
		}
		me._ht_node_bg.userData.onmouseenter=function (e) {
			me.elementMouseOver['ht_node_bg']=true;
			me._ht_node_image.logicBlock_alpha();
			me._ht_node_image.logicBlock_scaling();
		}
		me._ht_node_bg.userData.onmouseleave=function (e) {
			me.elementMouseOver['ht_node_bg']=false;
			me._ht_node_image.logicBlock_alpha();
			me._ht_node_image.logicBlock_scaling();
		}
		me._ht_node_bg.userData.ggUpdatePosition=function (useTransition) {
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
		el.translateY(0);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 36;
		el.userData.height = 36;
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
		clickTargetGeometry = new THREE.PlaneGeometry(36 / 100.0, 36 / 100.0, 5, 5 );
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
		me._ht_node_icon.userData.ggUpdatePosition=function (useTransition) {
		}
		me._ht_node_bg.add(me._ht_node_icon);
		el = new THREE.Mesh();
		el.translateX(0);
		el.translateY(0);
		el.scale.set(0.30, 0.30, 1.0);
		el.userData.width = 150;
		el.userData.height = 150;
		el.userData.scale = {x: 0.30, y: 0.30, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 20;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 20;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 20;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 20;
		el.name = 'ht_node_image';
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
			if (me._ht_node_image.material) me._ht_node_image.material.opacity = v;
			me._ht_node_image.visible = (v>0 && me._ht_node_image.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._ht_node_image.visible
			let parentEl = me._ht_node_image.parent;
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
			me._ht_node_image.userData.opacity = v;
			v = v * me._ht_node_image.userData.parentOpacity;
			if (me._ht_node_image.userData.setOpacityInternal) me._ht_node_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_image.children.length; i++) {
				let child = me._ht_node_image.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_image.userData.parentOpacity = v;
			v = v * me._ht_node_image.userData.opacity
			if (me._ht_node_image.userData.setOpacityInternal) me._ht_node_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_image.children.length; i++) {
				let child = me._ht_node_image.children[i];
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
		me._ht_node_image = el;
		loader = new THREE.TextureLoader();
		el.userData.ggNodeId=nodeId;
		texture = loader.load(basePath + 'images_vr/ht_node_image_' + nodeId + '.png');
		texture.colorSpace = player.getVRTextureColorSpace();
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'ht_node_image_material';
		el.material = material;
		el.userData.createGeometry = function(brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_node_image;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			let minDim = Math.min(el.userData.width, el.userData.height) / 2;
			el.userData.borderRadiusInnerShape.topLeft = Math.min(brTopLeft, minDim);
			el.userData.borderRadiusInnerShape.topRight = Math.min(brTopRight, minDim);
			el.userData.borderRadiusInnerShape.bottomRight = Math.min(brBottomRight, minDim);
			el.userData.borderRadiusInnerShape.bottomLeft = Math.min(brBottomLeft, minDim);
		let width = me._ht_node_image.userData.width / 100.0;
		let height = me._ht_node_image.userData.height / 100.0;
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_node_image.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_node_image.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_node_image.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_node_image.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_node_image_geometry';
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
		el.geometry = geometry;
		}
		el.userData.createGeometry(20, 20, 20, 20);
		el.userData.ggId="ht_node_image";
		me._ht_node_image.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.userData.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			return this.userData.ggNodeId;
		}
		me._ht_node_image.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['ht_node_bg'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._ht_node_image.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._ht_node_image.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._ht_node_image.ggCurrentLogicStateScaling == 0) {
					me._ht_node_image.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._ht_node_image.userData.transitions.length; i++) {
						if (me._ht_node_image.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_node_image.userData.transitions[i].interval);
							me._ht_node_image.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_node_image.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_node_image.scale.set(transition_scale.startScale.x + (me._ht_node_image.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_node_image.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_node_image.position.x = (me._ht_node_image.position.x - me._ht_node_image.userData.curScaleOffX) + scaleOffX;
							me._ht_node_image.userData.curScaleOffX = scaleOffX;
							me._ht_node_image.position.y = (me._ht_node_image.position.y - me._ht_node_image.userData.curScaleOffY) + scaleOffY;
							me._ht_node_image.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_node_image.userData.transitions.splice(me._ht_node_image.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_node_image.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._ht_node_image.userData.transitionValue_scale = {x: 0.3, y: 0.3, z: 1.0};
					for (var i = 0; i < me._ht_node_image.userData.transitions.length; i++) {
						if (me._ht_node_image.userData.transitions[i].property == 'scale') {
							clearInterval(me._ht_node_image.userData.transitions[i].interval);
							me._ht_node_image.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._ht_node_image.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_node_image.scale.set(transition_scale.startScale.x + (me._ht_node_image.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._ht_node_image.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._ht_node_image.position.x = (me._ht_node_image.position.x - me._ht_node_image.userData.curScaleOffX) + scaleOffX;
							me._ht_node_image.userData.curScaleOffX = scaleOffX;
							me._ht_node_image.position.y = (me._ht_node_image.position.y - me._ht_node_image.userData.curScaleOffY) + scaleOffY;
							me._ht_node_image.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._ht_node_image.userData.transitions.splice(me._ht_node_image.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._ht_node_image.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._ht_node_image.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['ht_node_bg'] == true))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._ht_node_image.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._ht_node_image.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._ht_node_image.ggCurrentLogicStateAlpha == 0) {
					me._ht_node_image.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._ht_node_image.userData.transitions.length; i++) {
						if (me._ht_node_image.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_node_image.userData.transitions[i].interval);
							me._ht_node_image.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_node_image.material ? me._ht_node_image.material.opacity : me._ht_node_image.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_node_image.userData.setOpacity(transition_alpha.startAlpha + (me._ht_node_image.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_node_image.userData.transitions.splice(me._ht_node_image.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_node_image.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._ht_node_image.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._ht_node_image.userData.transitions.length; i++) {
						if (me._ht_node_image.userData.transitions[i].property == 'alpha') {
							clearInterval(me._ht_node_image.userData.transitions[i].interval);
							me._ht_node_image.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._ht_node_image.material ? me._ht_node_image.material.opacity : me._ht_node_image.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._ht_node_image.userData.setOpacity(transition_alpha.startAlpha + (me._ht_node_image.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._ht_node_image.userData.transitions.splice(me._ht_node_image.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._ht_node_image.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._ht_node_image.userData.onclick=function (e) {
			player.openNext(player._(me.hotspot.url),player._(me.hotspot.target));
		}
		me._ht_node_image.userData.hasOwnClickAction = true;
		me._ht_node_image.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'ht_node_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.495);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 150;
		el.userData.height = 51;
		el.userData.scale = {x: 1.00, y: 1.00, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 0;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 0;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 0;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 0;
		el.name = 'ht_node_title';
		el.userData.x = 0;
		el.userData.y = -0.495;
		el.translateZ(0.040);
		el.userData.zIndex = -10000;
		el.userData.zIndexCurrent = -10000;
		el.userData.z = 0.040;
		el.rotateZ(0.00);
		el.userData.angle = 0.00;
		el.userData.mouseOverTouchMode = 'clicky';
		el.userData.hanchor = 1;
		el.userData.vanchor = 2;
		el.renderOrder = 4;
		el.userData.renderOrder = 4;
		el.userData.isVisible = function() {
			let vis = me._ht_node_title.visible
			let parentEl = me._ht_node_title.parent;
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
			me._ht_node_title.userData.opacity = v;
			v = v * me._ht_node_title.userData.parentOpacity;
			if (me._ht_node_title.userData.setOpacityInternal) me._ht_node_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_title.children.length; i++) {
				let child = me._ht_node_title.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._ht_node_title.userData.parentOpacity = v;
			v = v * me._ht_node_title.userData.opacity
			if (me._ht_node_title.userData.setOpacityInternal) me._ht_node_title.userData.setOpacityInternal(v);
			for (let i = 0; i < me._ht_node_title.children.length; i++) {
				let child = me._ht_node_title.children[i];
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
		me._ht_node_title = el;
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
		el.userData.borderRadius.default.bottomRight = 20;
		el.userData.borderRadius.default.bottomLeft = 20;
		el.userData.borderRadiusInnerShape = {};
		el.userData.createGeometry = function(bwTop, bwRight, bwBottom, bwLeft, brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._ht_node_title;
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
			skin.rectCalcBorderRadiiInnerShape(me._ht_node_title);
			if (skin.rectHasRoundedCorners(me._ht_node_title)) {
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._ht_node_title.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._ht_node_title.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._ht_node_title.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._ht_node_title.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'ht_node_title_geometry';
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
				geometry.name = 'ht_node_title_geometry';
			}
			el.geometry = geometry;
		}
		me._ht_node_title.userData.backgroundColorAlpha = 0.666667;
		me._ht_node_title.userData.borderColorAlpha = 1;
		me._ht_node_title.userData.setOpacityInternal = function(v) {
			me._ht_node_title.material.opacity = v;
			if (me._ht_node_title.userData.hasScrollbar) {
				me._ht_node_title.userData.scrollbar.material.opacity = v;
				me._ht_node_title.userData.scrollbarBg.material.opacity = v;
			}
			if (me._ht_node_title.userData.ggSubElement) {
				me._ht_node_title.userData.ggSubElement.material.opacity = v
				me._ht_node_title.userData.ggSubElement.visible = (v>0 && me._ht_node_title.userData.visible);
			}
			me._ht_node_title.visible = (v>0 && me._ht_node_title.userData.visible);
		}
		me._ht_node_title.userData.setBackgroundColor = function(v) {
			me._ht_node_title.material.color = v;
		}
		me._ht_node_title.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_title.userData.backgroundColorAlpha = v;
			me._ht_node_title.userData.setOpacity(me._ht_node_title.userData.opacity);
		}
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 20, 20);
		el.userData.backgroundColor = player.getTHREESkinColor('#000000');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 300;
		canvas.height = 102;
		el.userData.textCanvas = canvas;
		el.userData.textCanvasContext = canvas.getContext('2d');
		var tmpCanvas = document.createElement('canvas');
		el.userData.tmpCanvas = tmpCanvas;
		el.userData.tmpCanvasContext = tmpCanvas.getContext('2d');
		el.userData.ggTextureFromCanvas = function() {
			var el = me._ht_node_title;
			var canv = me._ht_node_title.userData.textCanvas;
			var ctx = me._ht_node_title.userData.textCanvasContext;
			var tmpCanv = me._ht_node_title.userData.tmpCanvas;
			ctx.clearRect(0, 0, canv.width, canv.height);
			ctx.fillStyle = 'rgba(' + me._ht_node_title.userData.backgroundColor.r * 255 + ', ' + me._ht_node_title.userData.backgroundColor.g * 255 + ', ' + me._ht_node_title.userData.backgroundColor.b * 255 + ', ' + me._ht_node_title.userData.backgroundColorAlpha + ')';
			ctx.fillRect(0, 0, canv.width, canv.height);
			if (tmpCanv.width > 0 && tmpCanv.height > 0) {
				ctx.drawImage(tmpCanv, 0, canv.height / 2 - tmpCanv.height / 2);
			}
			var textTexture = new THREE.CanvasTexture(canv);
			textTexture.name = 'ht_node_title_texture';
			textTexture.minFilter = THREE.LinearFilter;
			textTexture.colorSpace = THREE.LinearSRGBColorSpace;
			textTexture.wrapS = THREE.ClampToEdgeWrapping;
			textTexture.wrapT = THREE.ClampToEdgeWrapping;
			if (me._ht_node_title.material.map) {
				me._ht_node_title.material.map.dispose();
			}
			me._ht_node_title.material.map = textTexture;
			me._ht_node_title.material.needsUpdate = true;
			player.repaint();
		}
		el.userData.ggRenderText = function() {
			skin.removeChildren(me._ht_node_title, 'scrollbar');
			skin.paintTextDivToCanvas(me._ht_node_title, 'box-sizing: border-box; width: 150px; height: auto; font-size: 20px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre-line; padding: 10px 5px 5px 5px; overflow: hidden;' + '; color: ' + me._ht_node_title.userData.textColor + ' !important;', true, false, false);
			me._ht_node_title.userData.hasScrollbar = false;
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
			me._ht_node_title.userData.backgroundColor = v;
		}
		el.userData.setBackgroundColorAlpha = function(v) {
			me._ht_node_title.userData.backgroundColorAlpha = v;
		}
		el.userData.setTextColor = function(v) {
			me._ht_node_title.userData.textColor = '#' + v.getHexString();
		}
		el.userData.setTextColorAlpha = function(v) {
			me._ht_node_title.userData.textColorAlpha = v;
		}
		el.userData.ggId="ht_node_title";
		me._ht_node_title.userData.ggIsActive=function() {
			if ((this.parent) && (this.parent.ggIsActive)) {
				return this.parent.ggIsActive();
			}
			return false;
		}
		el.ggElementNodeId=function() {
			return me._ht_node_image.ggNodeId;
		}
		me._ht_node_title.logicBlock_visible = function() {
			var newLogicStateVisible;
			if (
				((player._(me.hotspot.title) == ""))
			)
			{
				newLogicStateVisible = 0;
			}
			else {
				newLogicStateVisible = -1;
			}
			if (me._ht_node_title.ggCurrentLogicStateVisible != newLogicStateVisible) {
				me._ht_node_title.ggCurrentLogicStateVisible = newLogicStateVisible;
				if (me._ht_node_title.ggCurrentLogicStateVisible == 0) {
			me._ht_node_title.visible=false;
			player.repaint();
			me._ht_node_title.userData.visible=false;
				}
				else {
			me._ht_node_title.visible=((!me._ht_node_title.material && Number(me._ht_node_title.userData.opacity>0)) || (me._ht_node_title.material && Number(me._ht_node_title.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_node_title.userData.visible=true;
				}
			}
		}
		me._ht_node_title.userData.ggUpdatePosition=function (useTransition) {
				me._ht_node_title.userData.ggUpdateText(true);
		}
		me._ht_node_image.add(me._ht_node_title);
		me._ht_node_bg.add(me._ht_node_image);
		me._ht_node.add(me._ht_node_bg);
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
		el.visible = true;
		el.userData.permeable = false;
		el.userData.visible = true;
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
				((me.hotspot.customimage == ""))
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
			me._ht_node_customimage.visible=false;
			player.repaint();
			me._ht_node_customimage.userData.visible=false;
				}
				else {
			me._ht_node_customimage.visible=((!me._ht_node_customimage.material && Number(me._ht_node_customimage.userData.opacity>0)) || (me._ht_node_customimage.material && Number(me._ht_node_customimage.material.opacity)>0))?true:false;
			player.repaint();
			me._ht_node_customimage.userData.visible=true;
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
		me._ht_node_bg.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_bg.traverse((obj)=>{
				if (me._ht_node_bg.material) {
					me._ht_node_bg.material.transparent = (me._ht_node_bg.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['ht_node_bg']=false;
		me._ht_node_bg.logicBlock_visible();
		me._ht_node_icon.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_icon.traverse((obj)=>{
				if (me._ht_node_icon.material) {
					me._ht_node_icon.material.transparent = (me._ht_node_icon.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_node_image.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_image.traverse((obj)=>{
				if (me._ht_node_image.material) {
					me._ht_node_image.material.transparent = (me._ht_node_image.userData.zIndexCurrent > 0);
					}
			});
		}
		me._ht_node_image.logicBlock_scaling();
		me._ht_node_image.logicBlock_alpha();
		me._ht_node_title.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._ht_node_title.traverse((obj)=>{
				if (me._ht_node_title.material) {
					me._ht_node_title.material.transparent = (me._ht_node_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._ht_node_title.userData.ggUpdateText(true);
		me._ht_node_title.logicBlock_visible();
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
				me._ht_node_bg.logicBlock_visible();
				me._ht_node_title.logicBlock_visible();
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
					me._ht_node_bg.traverse((obj)=>{
						if (me._ht_node_bg.material) {
							me._ht_node_bg.material.transparent = (me._ht_node_bg.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_node_bg.logicBlock_visible();
				if (player.get3dModelType() == 2) {
					me._ht_node_icon.traverse((obj)=>{
						if (me._ht_node_icon.material) {
							me._ht_node_icon.material.transparent = (me._ht_node_icon.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._ht_node_image.traverse((obj)=>{
						if (me._ht_node_image.material) {
							me._ht_node_image.material.transparent = (me._ht_node_image.userData.zIndexCurrent > 0);
							}
					});
				}
					me._ht_node_title.userData.ggUpdateText();
				if (player.get3dModelType() == 2) {
					me._ht_node_title.traverse((obj)=>{
						if (me._ht_node_title.material) {
							me._ht_node_title.material.transparent = (me._ht_node_title.userData.zIndexCurrent > 0);
							}
					});
				}
				me._ht_node_title.logicBlock_visible();
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
				me._ht_node_bg.logicBlock_visible();
				me._ht_node_title.logicBlock_visible();
				me._ht_node_customimage.logicBlock_visible();
			};
			me.__obj = me._ht_node;
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
		el.translateX(0);
		el.translateY(0);
		el.scale.set(0.87, 0.87, 1.0);
		el.userData.width = 150;
		el.userData.height = 92;
		el.userData.scale = {x: 0.87, y: 0.87, z: 1.0};
		el.userData.curScaleOffX = 0;
		el.userData.curScaleOffY = 0;
		el.userData.borderRadius = {};
		el.userData.borderRadiusInnerShape = {};
		el.userData.borderRadius.topLeft = el.userData.borderRadiusInnerShape.topLeft = 20;
		el.userData.borderRadius.topRight = el.userData.borderRadiusInnerShape.topRight = 20;
		el.userData.borderRadius.bottomRight = el.userData.borderRadiusInnerShape.bottomRight = 20;
		el.userData.borderRadius.bottomLeft = el.userData.borderRadiusInnerShape.bottomLeft = 20;
		el.name = 'node_image';
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
		el.userData.setOpacityInternal = function(v) {
			if (me._node_image.material) me._node_image.material.opacity = v;
			me._node_image.visible = (v>0 && me._node_image.userData.visible);
		}
		el.userData.isVisible = function() {
			let vis = me._node_image.visible
			let parentEl = me._node_image.parent;
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
			me._node_image.userData.opacity = v;
			v = v * me._node_image.userData.parentOpacity;
			if (me._node_image.userData.setOpacityInternal) me._node_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_image.children.length; i++) {
				let child = me._node_image.children[i];
				if (child.userData.setParentOpacity) {
					child.userData.setParentOpacity(v);
				}
			};
		}
		el.userData.setParentOpacity = function(v) {
			me._node_image.userData.parentOpacity = v;
			v = v * me._node_image.userData.opacity
			if (me._node_image.userData.setOpacityInternal) me._node_image.userData.setOpacityInternal(v);
			for (let i = 0; i < me._node_image.children.length; i++) {
				let child = me._node_image.children[i];
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
		me._node_image = el;
		loader = new THREE.TextureLoader();
		el.userData.ggNodeId=nodeId;
		texture = loader.load(basePath + 'images_vr/node_image_' + nodeId + '.png');
		texture.colorSpace = player.getVRTextureColorSpace();
		material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide, transparent: true} );
		material.name = 'node_image_material';
		el.material = material;
		el.userData.createGeometry = function(brTopLeft, brTopRight, brBottomRight, brBottomLeft) {
			let el = me._node_image;
			skin.disposeGeometryAndMaterial(el);
			skin.removeChildren(el, 'subElement');
			let minDim = Math.min(el.userData.width, el.userData.height) / 2;
			el.userData.borderRadiusInnerShape.topLeft = Math.min(brTopLeft, minDim);
			el.userData.borderRadiusInnerShape.topRight = Math.min(brTopRight, minDim);
			el.userData.borderRadiusInnerShape.bottomRight = Math.min(brBottomRight, minDim);
			el.userData.borderRadiusInnerShape.bottomLeft = Math.min(brBottomLeft, minDim);
		let width = me._node_image.userData.width / 100.0;
		let height = me._node_image.userData.height / 100.0;
		roundedRectShape = new THREE.Shape();
		let borderRadiusTL = me._node_image.userData.borderRadiusInnerShape.topLeft / 100.0;
		let borderRadiusTR = me._node_image.userData.borderRadiusInnerShape.topRight / 100.0;
		let borderRadiusBR = me._node_image.userData.borderRadiusInnerShape.bottomRight / 100.0;
		let borderRadiusBL = me._node_image.userData.borderRadiusInnerShape.bottomLeft / 100.0;
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
		geometry.name = 'node_image_geometry';
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
		el.geometry = geometry;
		}
		el.userData.createGeometry(20, 20, 20, 20);
		el.userData.ggId="node_image";
		me._node_image.userData.ggIsActive=function() {
			return player.getCurrentNode()==this.userData.ggElementNodeId();
		}
		el.userData.ggElementNodeId=function() {
			return this.userData.ggNodeId;
		}
		me._node_image.logicBlock_scaling = function() {
			var newLogicStateScaling;
			if (
				((me.elementMouseOver['node_image'] == true))
			)
			{
				newLogicStateScaling = 0;
			}
			else {
				newLogicStateScaling = -1;
			}
			if (me._node_image.ggCurrentLogicStateScaling != newLogicStateScaling) {
				me._node_image.ggCurrentLogicStateScaling = newLogicStateScaling;
				if (me._node_image.ggCurrentLogicStateScaling == 0) {
					me._node_image.userData.transitionValue_scale = {x: 1, y: 1, z: 1.0};
					for (var i = 0; i < me._node_image.userData.transitions.length; i++) {
						if (me._node_image.userData.transitions[i].property == 'scale') {
							clearInterval(me._node_image.userData.transitions[i].interval);
							me._node_image.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._node_image.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._node_image.scale.set(transition_scale.startScale.x + (me._node_image.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._node_image.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._node_image.position.x = (me._node_image.position.x - me._node_image.userData.curScaleOffX) + scaleOffX;
							me._node_image.userData.curScaleOffX = scaleOffX;
							me._node_image.position.y = (me._node_image.position.y - me._node_image.userData.curScaleOffY) + scaleOffY;
							me._node_image.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._node_image.userData.transitions.splice(me._node_image.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._node_image.userData.transitions.push(transition_scale);
					}
				}
				else {
					me._node_image.userData.transitionValue_scale = {x: 0.87, y: 0.87, z: 1.0};
					for (var i = 0; i < me._node_image.userData.transitions.length; i++) {
						if (me._node_image.userData.transitions[i].property == 'scale') {
							clearInterval(me._node_image.userData.transitions[i].interval);
							me._node_image.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_scale = {};
						transition_scale.property = 'scale';
						transition_scale.startTime = Date.now();
						transition_scale.startScale = structuredClone(me._node_image.scale);
						transition_scale.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_scale.startTime) / 500;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._node_image.scale.set(transition_scale.startScale.x + (me._node_image.userData.transitionValue_scale.x - transition_scale.startScale.x) * tfval, transition_scale.startScale.y + (me._node_image.userData.transitionValue_scale.y - transition_scale.startScale.y) * tfval, 1.0);
							var scaleOffX = 0;
							var scaleOffY = 0;
							me._node_image.position.x = (me._node_image.position.x - me._node_image.userData.curScaleOffX) + scaleOffX;
							me._node_image.userData.curScaleOffX = scaleOffX;
							me._node_image.position.y = (me._node_image.position.y - me._node_image.userData.curScaleOffY) + scaleOffY;
							me._node_image.userData.curScaleOffY = scaleOffY;
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_scale.interval);
								me._node_image.userData.transitions.splice(me._node_image.userData.transitions.indexOf(transition_scale), 1);
							}
						}, 20);
						me._node_image.userData.transitions.push(transition_scale);
					}
				}
			}
		}
		me._node_image.userData.onclick=function (e) {
			player.openNext("{"+me.ggNodeId+"}","");
		}
		me._node_image.userData.hasOwnClickAction = true;
		me._node_image.userData.onmouseenter=function (e) {
			me.elementMouseOver['node_image']=true;
			me._node_title.logicBlock_alpha();
			me._node_image.logicBlock_scaling();
		}
		me._node_image.userData.ontouchend=function (e) {
			me._node_image.logicBlock_scaling();
		}
		me._node_image.userData.onmouseleave=function (e) {
			me.elementMouseOver['node_image']=false;
			me._node_title.logicBlock_alpha();
			me._node_image.logicBlock_scaling();
		}
		me._node_image.userData.ggUpdatePosition=function (useTransition) {
		}
		el = new THREE.Mesh();
			material = new THREE.MeshBasicMaterial( {side : THREE.DoubleSide, transparent : (player.get3dModelType() != 2 || true) } ); 
			el.userData.transparentIn3d = material.transparent;
			material.name = 'node_title_material';
			el.material = material;
		el.translateX(0);
		el.translateY(-0.26);
		el.scale.set(1.00, 1.00, 1.0);
		el.userData.width = 150;
		el.userData.height = 40;
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
		el.userData.y = -0.26;
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
		el.userData.opacity = 0.00;
		el.userData.parentOpacity = 1.0;
		el.userData.transitions = [];
		me._node_title = el;
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
		el.userData.borderRadius.default.bottomRight = 20;
		el.userData.borderRadius.default.bottomLeft = 20;
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
		}
		me._node_title.userData.backgroundColorAlpha = 0.666667;
		me._node_title.userData.borderColorAlpha = 1;
		me._node_title.userData.setOpacityInternal = function(v) {
			me._node_title.material.opacity = v;
			if (me._node_title.userData.hasScrollbar) {
				me._node_title.userData.scrollbar.material.opacity = v;
				me._node_title.userData.scrollbarBg.material.opacity = v;
			}
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
		el.userData.createGeometry(0, 0, 0, 0, 0, 0, 20, 20);
		el.userData.backgroundColor = player.getTHREESkinColor('#000000');
		el.userData.textColor = '#c2e812';
		el.userData.textColorAlpha = 1;
		var canvas = document.createElement('canvas');
		canvas.width = 300;
		canvas.height = 80;
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
			skin.paintTextDivToCanvas(me._node_title, 'box-sizing: border-box; width: 150px; height: auto; font-size: 16px; font-weight: inherit; color: rgba(194,232,18,1); text-align: center; white-space: pre-line; padding: 10px 5px 5px 5px; overflow: hidden;' + '; color: ' + me._node_title.userData.textColor + ' !important;', true, false, false);
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
			return me._node_image.ggNodeId;
		}
		me._node_title.logicBlock_alpha = function() {
			var newLogicStateAlpha;
			if (
				((me.elementMouseOver['node_image'] == true)) && 
				((me.ggUserdata.title != ""))
			)
			{
				newLogicStateAlpha = 0;
			}
			else {
				newLogicStateAlpha = -1;
			}
			if (me._node_title.ggCurrentLogicStateAlpha != newLogicStateAlpha) {
				me._node_title.ggCurrentLogicStateAlpha = newLogicStateAlpha;
				if (me._node_title.ggCurrentLogicStateAlpha == 0) {
					me._node_title.userData.transitionValue_alpha = 1;
					for (var i = 0; i < me._node_title.userData.transitions.length; i++) {
						if (me._node_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._node_title.userData.transitions[i].interval);
							me._node_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._node_title.material ? me._node_title.material.opacity : me._node_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._node_title.userData.setOpacity(transition_alpha.startAlpha + (me._node_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._node_title.userData.transitions.splice(me._node_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._node_title.userData.transitions.push(transition_alpha);
					}
				}
				else {
					me._node_title.userData.transitionValue_alpha = 0;
					for (var i = 0; i < me._node_title.userData.transitions.length; i++) {
						if (me._node_title.userData.transitions[i].property == 'alpha') {
							clearInterval(me._node_title.userData.transitions[i].interval);
							me._node_title.userData.transitions.splice(i, 1);
							break;
						}
					}
					{
						let transition_alpha = {};
						transition_alpha.property = 'alpha';
						transition_alpha.startTime = Date.now();
						transition_alpha.startAlpha = me._node_title.material ? me._node_title.material.opacity : me._node_title.userData.opacity;
						transition_alpha.interval = setInterval(() => {
							let currentTime = Date.now() - 0;
							let percentDone = 1.0 * (currentTime - transition_alpha.startTime) / 300;
							percentDone = Math.max(percentDone, 0.0);
							percentDone = Math.min(percentDone, 1.0);
							let tfval = -(Math.cos(Math.PI * percentDone) - 1) / 2;
							me._node_title.userData.setOpacity(transition_alpha.startAlpha + (me._node_title.userData.transitionValue_alpha - transition_alpha.startAlpha) * tfval);
							player.repaint();
							if (percentDone >= 1.0) {
								clearInterval(transition_alpha.interval);
								me._node_title.userData.transitions.splice(me._node_title.userData.transitions.indexOf(transition_alpha), 1);
							}
						}, 20);
						me._node_title.userData.transitions.push(transition_alpha);
					}
				}
			}
		}
		me._node_title.userData.ggUpdatePosition=function (useTransition) {
				me._node_title.userData.ggUpdateText(true);
		}
		me._node_image.add(me._node_title);
		me.__obj.add(me._node_image);
		me._node_image.userData.setOpacity(1.00);
		if (player.get3dModelType() == 2) {
			me._node_image.traverse((obj)=>{
				if (me._node_image.material) {
					me._node_image.material.transparent = (me._node_image.userData.zIndexCurrent > 0);
					}
			});
		}
		me.elementMouseOver['node_image']=false;
		me._node_image.logicBlock_scaling();
		me._node_title.userData.setOpacity(0.00);
		if (player.get3dModelType() == 2) {
			me._node_title.traverse((obj)=>{
				if (me._node_title.material) {
					me._node_title.material.transparent = (me._node_title.userData.zIndexCurrent > 0);
					}
			});
		}
			me._node_title.userData.ggUpdateText(true);
		me._node_title.logicBlock_alpha();
			me.ggEvent_activehotspotchanged=function() {
				me._node_title.logicBlock_alpha();
			};
			me.ggEvent_changenode=function() {
				if (player.get3dModelType() == 2) {
					me._node_image.traverse((obj)=>{
						if (me._node_image.material) {
							me._node_image.material.transparent = (me._node_image.userData.zIndexCurrent > 0);
							}
					});
				}
				if (player.get3dModelType() == 2) {
					me._node_title.traverse((obj)=>{
						if (me._node_title.material) {
							me._node_title.material.transparent = (me._node_title.userData.zIndexCurrent > 0);
							}
					});
				}
				me._node_title.logicBlock_alpha();
			};
			me.ggEvent_configloaded=function() {
				me._node_title.logicBlock_alpha();
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
			if (hotspot.skinid=='ht_node') {
			hotspot.skinid = 'ht_node';
			hsinst = new SkinHotspotClass_ht_node__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_node__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_node__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_node__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_image') {
			hotspot.skinid = 'ht_image';
			hsinst = new SkinHotspotClass_ht_image__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_image__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_image__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_info') {
			hotspot.skinid = 'ht_info';
			hsinst = new SkinHotspotClass_ht_info__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_info__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_info__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_info__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_video_file') {
			hotspot.skinid = 'ht_video_file';
			hsinst = new SkinHotspotClass_ht_video_file__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_file__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_video_file__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_video_file__3d'].push(hsinst);
		} else
			if (hotspot.skinid=='ht_video_url') {
			hotspot.skinid = 'ht_video_url';
			hsinst = new SkinHotspotClass_ht_video_url__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_video_url__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_video_url__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_video_url__3d'].push(hsinst);
		} else
		{
			hotspot.skinid = 'ht_image_1';
			hsinst = new SkinHotspotClass_ht_image_1__3d(me, hotspot);
			if (!hotspotTemplates.hasOwnProperty('SkinHotspotClass_ht_image_1__3d')) {
				hotspotTemplates['SkinHotspotClass_ht_image_1__3d'] = [];
			}
			hotspotTemplates['SkinHotspotClass_ht_image_1__3d'].push(hsinst);
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