
var todoList = [
    {
        task: 'brush the cat',
        todoDone: false
    }
]

$(document).ready(function(){

// set jQuery variable for populating DOM at ID #todo-list
var $todoList = $('#todo-list')
var $noTodos = $('#noTodos')

var table = ''

// create function to populate DOM
var showData = function(dataSource){
    if (dataSource.length === 0){
        $noTodos.empty()
        $todoList.empty()
        $noTodos.append('<b>No more to-do items!</b></br>')
        if (dataSource.length){
            for(let data of dataSource){
                var task_id = data._id
                var taskLi = `<tr><td class="task" id="taskid_${data._id}">${data.task}</td>`
                var taskLiCompleted = `<tr><td class="task taskDone" id="taskid_${data._id}">${data.task}</td>`
                var buttons = `<td><button class="btn btn-sm btn-primary icon-btn" id="doneid_${data._id}"><span class="glyphicon btn-glyphicon glyphicon-thumbs-up img-circle text-primary"></span>Completed</button></td><td> <button class="btn btn-sm btn-danger icon-btn" id="delid_${data._id}"><span class="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger"></span>Delete</button></td>`
                // this needs correction as it should be boolean not string of 'false'
                if (!data.todoDone){ 
                    $todoList.append(taskLi+buttons+`</tr>`)
                } else {
                    $todoList.append(taskLiCompleted+buttons+`</tr>`)
                }      
            }   
        }
    } 

    else {
        $noTodos.empty()
        $todoList.empty()
                console.log(dataSource)

        for(let data of dataSource){
            var task_id = data._id
            var taskLi = `<tr><td class="task" id="taskid_${data._id}">${data.task}</td>`
            var taskLiCompleted = `<tr><td class="task taskDone" id="taskid_${data._id}">${data.task}</td>`
            var buttons = `<td>
            <button class="btn btn-sm btn-primary icon-btn" id="doneid_${data._id}">
            <span class="glyphicon btn-glyphicon glyphicon-thumbs-up img-circle text-primary"></span>Completed
            </button>
            </td>
            <td> <button class="btn btn-sm btn-danger icon-btn" id="delid_${data._id}">
            <span class="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger"></span>Delete
            </button>
            </td>`
            // this needs correction as it should be boolean not string of 'false'
            if (!data.todoDone){ 
                $todoList.append(taskLi+buttons+`</tr>`)
            } else {
                $todoList.append(taskLiCompleted+buttons+`</tr>`)
            }      
            $(document).on('click', `#doneid_${data._id}`, function(event){
                $.post('/todo/done', {
                    _id: data._id}, function(data, status){
                    console.log(event)
                    }   )
                    console.log('You clicked Completed')
                    getFreshData()
            }) 
            $(document).on('click', `#delid_${data._id}`, function(event){
                console.log('clicked on: ', data._id)
                $.post('/todo/del', {
                    _id: data._id}, function(data, status){

                    console.log(event.target.id.slice(6))
                    }   )
                    console.log('You clicked Delete!')
                    getFreshData()
            }) 

        }
    }
}


// create function to get fresh data from server
var getFreshData = function(){
    $.get('/todo/all', function(dataFromServer){
        showData(dataFromServer)
    })
}
getFreshData()


// POST form input to server
$('#todo-button').on('click', function(event){
    event.preventDefault()
    var newToDo = {
        task: $('#todo-input').val(),
        todoDone: false
    }
    if (newToDo.task !== ''){
        $.post('/todo', {
            // note that JSON.stringify should not be needed because this is something jQuery does automatically, but it seems that it's not working properly and so we're manually doing it here.
            newtodo: JSON.stringify(newToDo),
        }).done(function(data, status){
            console.log(newToDo)
        
        getFreshData()
        // empty the input box after clicking on the button
        $("#todo-input").val('')
        
        })
        .fail(function(error) { console.log(error) })
    } 

})

// $('#del-form').on('click', function(){
//         // event.preventDefault()
//         var delInput = $('#del-input').val()
//         console.log(delInput)
//         // var details = $('#del-button').serialize()
//         console.log($('#del-input').serialize())
//         $.post('/todo/del', $(delInput).serialize(), function(data){
//             console.log($(delInput).serialize())
//             getFreshData()
//         })
//     })






// $('body').on('click', '#todo-list li', function(event){
//     $.post('/todo/done', task.todoDone, function(data, status){
//     console.log(task.todoDone)
//     $(this).toggleClass("strikeThru")
//     console.log(this)
//     })
// })

// $('body').on('click', '#todo-list button', function(event){
//     console.log(event)
//     // remove the li and the button from the DOM by deleting the parent
//     $(this).parent().remove()
//     // define a variable as shorthand for the index position for the particular li in question
//     var taskNumber = $(event.target).attr('data-todo-num')
//     // splice the todoList to remove that item (this is necessary because the .remove() method only removes from the DOM)
//     todoList.splice(taskNumber, 1)
//     })
})
