define(["utils/utils","mvc/ui/ui-portlet","mvc/ui/ui-misc","mvc/form/form-section","mvc/form/form-data"],function(c,b,e,a,d){return Backbone.View.extend({initialize:function(f){this.optionsDefault={is_dynamic:true,narrow:false,initial_errors:false,cls:"ui-portlet-limited"};this.options=c.merge(f,this.optionsDefault);console.debug(this.options);var g=parent.Galaxy;if(g&&g.modal){this.modal=g.modal}else{this.modal=new e.Modal.View()}this.setElement("<div/>");this._build()},wait:function(j){for(var g in this.input_list){var h=this.field_list[g];var f=this.input_list[g];if(f.is_dynamic&&h.wait&&h.unwait){if(j){h.wait()}else{h.unwait()}}}},reciept:function(f){this.$el.empty();this.$el.append(f)},highlight:function(g,h,f){var i=this.element_list[g];if(i){i.error(h||"Please verify this parameter.");if(!f){$("html, body").animate({scrollTop:i.$el.offset().top-20},500)}}},errors:function(h){this.trigger("reset");if(h&&h.errors){var i=this.data.matchResponse(h.errors);for(var g in this.element_list){var f=this.element_list[g];if(i[g]){this.highlight(g,i[g],true)}}}},_build:function(){var f=this;this.off("change");this.off("reset");this.field_list={};this.input_list={};this.element_list={};this.data=new d(this);this._renderForm();this.data.create();if(this.options.initial_errors){this.errors(this.options)}var g=this.data.checksum();this.on("change",function(){var h=f.data.checksum();if(h!=g){g=h;f.options.onchange&&f.options.onchange()}});this.on("reset",function(){for(var h in this.element_list){this.element_list[h].reset()}})},_renderForm:function(){this.message=new e.Message();this.section=new a.View(this,{inputs:this.options.inputs});this.portlet=new b.View({icon:"fa-wrench",title:this.options.title,cls:this.options.cls,operations:this.options.operations,buttons:this.options.buttons});this.portlet.append(this.message.$el.addClass("ui-margin-top"));this.portlet.append(this.section.$el);this.$el.empty();this.$el.append(this.portlet.$el);if(this.options.message){this.message.update({persistent:true,status:"warning",message:this.options.message})}console.debug("tools-form-base::initialize() - Completed.")}})});