define(["mvc/dataset/states","mvc/dataset/hda-base","mvc/tags","mvc/annotations","utils/localization"],function(i,f,g,a,d){var h=f.HDABaseView;var c=h.extend({initialize:function(j){h.prototype.initialize.call(this,j);this.hasUser=j.hasUser;this.defaultPrimaryActionButtonRenderers=[this._render_showParamsButton,this._render_rerunButton];this.purgeAllowed=j.purgeAllowed||false;this.tagsEditorShown=j.tagsEditorShown||false;this.annotationEditorShown=j.annotationEditorShown||false},_render_titleButtons:function(){return h.prototype._render_titleButtons.call(this).concat([this._render_editButton(),this._render_deleteButton()])},_render_editButton:function(){if((this.model.get("state")===i.DISCARDED)||(this.model.get("state")===i.NOT_VIEWABLE)||(!this.model.get("accessible"))){return null}var l=this.model.get("purged"),j=this.model.get("deleted"),k={title:d("Edit attributes"),href:this.urls.edit,target:this.linkTarget,classes:"dataset-edit"};if(j||l){k.disabled=true;if(l){k.title=d("Cannot edit attributes of datasets removed from disk")}else{if(j){k.title=d("Undelete dataset to edit attributes")}}}else{if(this.model.get("state")===i.UPLOAD){k.disabled=true;k.title=d("This dataset must finish uploading before it can be edited")}else{if(this.model.get("state")===i.NEW){k.disabled=true;k.title=d("This dataset is not yet editable")}}}k.faIcon="fa-pencil";return faIconButton(k)},_render_deleteButton:function(){if((this.model.get("state")===i.NOT_VIEWABLE)||(!this.model.get("accessible"))){return null}var j=this,k={title:d("Delete"),classes:"dataset-delete",onclick:function(){j.$el.find(".icon-btn.dataset-delete").trigger("mouseout");j.model["delete"]()}};if(this.model.get("deleted")||this.model.get("purged")){k={title:d("Dataset is already deleted"),disabled:true}}k.faIcon="fa-times";return faIconButton(k)},_render_errButton:function(){if(this.model.get("state")!==i.ERROR){return null}return faIconButton({title:d("View or report this error"),href:this.urls.report_error,classes:"dataset-report-error-btn",target:this.linkTarget,faIcon:"fa-bug"})},_render_rerunButton:function(){return faIconButton({title:d("Run this job again"),href:this.urls.rerun,classes:"dataset-rerun-btn",target:this.linkTarget,faIcon:"fa-refresh"})},_render_visualizationsButton:function(){var j=this.model.get("visualizations");if((!this.hasUser)||(!this.model.hasData())||(_.isEmpty(j))){return null}if(_.isObject(j[0])){return this._render_visualizationsFrameworkButton(j)}if(!this.urls.visualization){return null}var l=this.model.get("dbkey"),p=this.urls.visualization,m={},q={dataset_id:this.model.get("id"),hda_ldda:"hda"};if(l){q.dbkey=l}var k=faIconButton({title:d("Visualize"),classes:"dataset-visualize-btn",faIcon:"fa-bar-chart-o"});function n(r){if(r==="trackster"){return b(p,q,l)}return function(){Galaxy.frame.add({title:"Visualization",type:"url",content:p+"/"+r+"?"+$.param(q)})}}function o(r){return r.charAt(0).toUpperCase()+r.slice(1)}if(j.length===1){k.attr("data-original-title",d("Visualize in")+" "+d(o(j[0])));k.click(n(j[0]))}else{_.each(j,function(r){m[d(o(r))]=n(r)});make_popupmenu(k,m)}return k},_render_visualizationsFrameworkButton:function(j){if(!(this.model.hasData())||!(j&&!_.isEmpty(j))){return null}var l=faIconButton({title:d("Visualize"),classes:"dataset-visualize-btn",faIcon:"fa-bar-chart-o"});if(j.length===1){var k=j[0];l.attr("data-original-title",d("Visualize in")+" "+k.html);l.attr("href",k.href)}else{var m=[];_.each(j,function(n){n.func=function(o){if(Galaxy.frame&&Galaxy.frame.active){Galaxy.frame.add({title:"Visualization",type:"url",content:n.href});o.preventDefault();return false}return true};m.push(n);return false});PopupMenu.create(l,m)}return l},_buildNewRender:function(){var j=h.prototype._buildNewRender.call(this);var k="<br />",m=".",l=function(n,o){return['<a href="javascript:void(0)" class="',o,'">',n,"</a>"].join("")};j.find(".dataset-deleted-msg").append([k,l(d("Undelete it"),"dataset-undelete"),m].join(""));if(this.purgeAllowed){j.find(".dataset-deleted-msg").append([k,l(d("Permanently remove it from disk"),"dataset-purge"),m].join(""))}j.find(".dataset-hidden-msg").append([k,l(d("Unhide it"),"dataset-unhide"),m].join(""));return j},_render_body_failed_metadata:function(){var k=$("<a/>").attr({href:this.urls.edit,target:this.linkTarget}).text(d("set it manually or retry auto-detection")),j=$("<span/>").text(". "+d("You may be able to")+" ").append(k),l=h.prototype._render_body_failed_metadata.call(this);l.find(".warningmessagesmall strong").append(j);return l},_render_body_error:function(){var j=h.prototype._render_body_error.call(this);j.find(".dataset-actions .left").prepend(this._render_errButton());return j},_render_body_ok:function(){var j=h.prototype._render_body_ok.call(this);if(this.model.isDeletedOrPurged()){return j}this.makeDbkeyEditLink(j);if(this.hasUser){j.find(".dataset-actions .left").append(this._render_visualizationsButton());this._renderTags(j);this._renderAnnotation(j)}return j},_renderTags:function(j){var k=this;this.tagsEditor=new g.TagsEditor({model:this.model,el:j.find(".tags-display"),onshowFirstTime:function(){this.render()},onshow:function(){k.tagsEditorShown=true},onhide:function(){k.tagsEditorShown=false},$activator:faIconButton({title:d("Edit dataset tags"),classes:"dataset-tag-btn",faIcon:"fa-tags"}).appendTo(j.find(".dataset-actions .right"))});if(this.tagsEditorShown){this.tagsEditor.toggle(true)}},_renderAnnotation:function(j){var k=this;this.annotationEditor=new a.AnnotationEditor({model:this.model,el:j.find(".annotation-display"),onshowFirstTime:function(){this.render()},onshow:function(){k.annotationEditorShown=true},onhide:function(){k.annotationEditorShown=false},$activator:faIconButton({title:d("Edit dataset annotation"),classes:"dataset-annotate-btn",faIcon:"fa-comment"}).appendTo(j.find(".dataset-actions .right"))});if(this.annotationEditorShown){this.annotationEditor.toggle(true)}},makeDbkeyEditLink:function(k){if(this.model.get("metadata_dbkey")==="?"&&!this.model.isDeletedOrPurged()){var j=$('<a class="value">?</a>').attr("href",this.urls.edit).attr("target",this.linkTarget);k.find(".dataset-dbkey .value").replaceWith(j)}},events:_.extend(_.clone(h.prototype.events),{"click .dataset-undelete":function(j){this.model.undelete();return false},"click .dataset-unhide":function(j){this.model.unhide();return false},"click .dataset-purge":"confirmPurge"}),confirmPurge:function e(j){this.model.purge();return false},toString:function(){var j=(this.model)?(this.model+""):("(no model)");return"HDAEditView("+j+")"}});function b(j,l,k){return function(){var m={};if(k){m["f-dbkey"]=k}$.ajax({url:j+"/list_tracks?"+$.param(m),dataType:"html",error:function(){alert(("Could not add this dataset to browser")+".")},success:function(n){var o=window.parent;o.Galaxy.modal.show({title:"View Data in a New or Saved Visualization",buttons:{Cancel:function(){o.Galaxy.modal.hide()},"View in saved visualization":function(){o.Galaxy.modal.show({title:"Add Data to Saved Visualization",body:n,buttons:{Cancel:function(){o.Galaxy.modal.hide()},"Add to visualization":function(){$(o.document).find("input[name=id]:checked").each(function(){o.Galaxy.modal.hide();var p=$(this).val();l.id=p;o.Galaxy.frame.add({title:"Trackster",type:"url",content:j+"/trackster?"+$.param(l)})})}}})},"View in new visualization":function(){o.Galaxy.modal.hide();var p=j+"/trackster?"+$.param(l);o.Galaxy.frame.add({title:"Trackster",type:"url",content:p})}}})}});return false}}return{HDAEditView:c}});