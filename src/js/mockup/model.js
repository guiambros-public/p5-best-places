var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    initialize: function(){
        //
    }
});
var todo_model = new Todo({
    title: 'Check attributes property of the logged models in the console.',
    completed: true
});
todo_model.set("title", "This is the new title coming from model");
