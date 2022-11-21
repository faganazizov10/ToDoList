let myul_ = document.querySelector("#myUl")
var Element = {
  counter_id: 0,
  createNew: function (elemName, parentName, parentIndex, elemText) {
    if (elemName !== undefined && parentName !== undefined && parentIndex !== undefined) {
      if (typeof elemName === "string" && typeof parentName === "string" && typeof parentIndex === "number") {
        var elem = document.createElement(elemName);
        elem.setAttribute('draggable', true);
        this.counter_id += 1
        elem.setAttribute('id', this.counter_id);
        //drG START

        elem.addEventListener('dragstart', (li) => {
          li.dataTransfer.setData("text", li.target.id)
          // console.log(li.target.id)
        })
        myul_.addEventListener("dragover", (li) => {
          li.preventDefault()
        })
        myul_.addEventListener("drop", (li) => {
          const dragedItemId = li.dataTransfer.getData("text")
          myul_.append(document.getElementById(dragedItemId))
        })
        //drG END


        var parent = document.getElementsByClassName(parentName)[parentIndex];
        parent.appendChild(elem);
        if (elemText !== undefined && typeof elemText == "string") {
          elem.innerHTML = elemText;
        }
      } else {
        throw new Error("Type checking of arguments has been failed");
      }
    } else {
      throw new Error("One or more argument is missing");
    }
  }
};
var taskStats = {
  totalTasks: 0,
  completedTasks: 0,
  remainingTasks: 0
};
var htmlElement = {
  taskName: document.getElementById('taskName')
};
function addNew() {
  var taskName = document.getElementById('task-name');
  var today = new Date().toLocaleTimeString();
  var errorBox = document.getElementsByClassName('modal-parent')[1];
  var alertText = document.getElementById('error-text');
  var fullText = taskName.value + '<br/><time>Created : ' + today + '</time><button class = "btn-success">A</button><button class = "btn-primary">B</button><button class = "btn-danger">C</button>';
  if (taskName.value == '' || taskName.value == null) {
    errorBox.className = 'modal-parent show';
    alertText.innerHTML = 'Input field is empty';
  } else {
    Element.createNew('li', 'tasks', 0, fullText);
    document.getElementById('total-tasks').innerHTML = count();
    taskName.value = '';
  }

  document.getElementById('tasks-remaining').innerHTML = countRemaining();
}

function addListener(e) {
  e.parentNode.parentNode.removeChild(e.parentNode);
  document.getElementById('total-tasks').innerHTML = count();
  document.getElementById('tasks-remaining').innerHTML = countRemaining();
}

function resetList() {
  var parent = document.getElementsByClassName('tasks')[0];
  var cancelBtn = document.getElementById('cancel');
  var proceedBtn = document.getElementById('proceed');
  var modalBox = document.getElementsByClassName('modal-parent');
  var listLength = taskStats.totalTasks;
  var alertText = document.getElementById('error-text');
  if (listLength === 0) {
    modalBox[1].className = 'modal-parent show';
    alertText.innerHTML = 'List is already empty';
  } else {
    modalBox[2].className = 'modal-parent show';
  }
  cancelBtn.onclick = function () {
    modalBox[2].className = 'modal-parent hide';
  }
  proceedBtn.onclick = function () {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    document.getElementById('total-tasks').innerHTML = count();
    document.getElementById('completed-tasks').innerHTML = countCompleted();
    document.getElementById('tasks-remaining').innerHTML = countRemaining();
    modalBox[2].className = 'modal-parent hide';
  }
}
function openModal(e) {
  var that = e;
  var modalBox = document.getElementsByClassName('modal-parent');
  var changeBtn = document.getElementById('edit-btn');
  var errorBox = document.getElementsByClassName('error-box');
  var alertText = document.getElementById('error-text');
  var taskName = document.getElementById('edit-value');
  var previousTask = e.parentNode.innerHTML.split('<')[0];
  var today = new Date().toLocaleTimeString();
  var preserved = taskName.value;

  modalBox[0].className = 'modal-parent show';
  taskName.value = previousTask;
  changeBtn.onclick = function (that) {
    if (taskName.value == '' || taskName.value == null) {
      modalBox[1].className = 'modal-parent show';
      alertText.innerHTML = 'Please add value in input field';
    } else {
      e.parentNode.innerHTML = taskName.value + '<br/><time>Edited : ' + today + '</time><button class = "btn-success" >A</button><button class = "btn-primary" >B</button><button class = "btn-danger" >C</button>';

      modalBox[1].className = 'modal-parent show';

      modalBox[0].className = 'modal-parent hide';

      alertText.innerHTML = 'Value has been changed from ' + previousTask + ' to ' + taskName.value;

      taskName.value = '';
    }
  }
}
function closeModal() {
  var editBox = document.getElementsByClassName('modal-parent')[0];
  editBox.className = 'modal-parent hide';
}
function closeAlert() {
  var errorBox = document.getElementsByClassName('modal-parent')[1];
  errorBox.className = 'modal-parent hide';
}
function closeConfirm() {
  var confirmBox = document.getElementsByClassName('modal-parent')[2];
  confirmBox.className = 'modal-parent hide';
}


function completed(e) {
  e.parentNode.style.cssText += 'pointer-events: none; opacity: 0.9;';
  e.innerHTML = 'X';
  e.parentNode.className = 'has-completed';
  e.parentNode.innerHTML = '<del>' + e.parentNode.innerHTML + '</del>';
  document.getElementById('completed-tasks').innerHTML = countCompleted();
  document.getElementById('tasks-remaining').innerHTML = countRemaining();
}

function count() {
  taskStats.totalTasks = document.getElementsByClassName('tasks')[0].children.length;
  return taskStats.totalTasks;
}
function countCompleted() {
  taskStats.completedTasks = document.getElementsByClassName('has-completed').length;
  return taskStats.completedTasks;
}
function countRemaining() {
  taskStats.remainingTasks = taskStats.totalTasks - taskStats.completedTasks;
  return taskStats.remainingTasks;
}
function bindEvent(elem, eventName, eventHandler) {
  if (elem.addEventListener) {
    elem.addEventListener(eventName, eventHandler, true);
  } else if (elem.attachEvent) {
    elem.attachEvent('on' + eventName, eventHandler);
  }
}

function getEventTarget(e) {
  var event = e || window.event;
  return event.target || event.srcElement;
}

function hasClass(selector, match) {
  return selector.className.split(" ").indexOf(match) > -1;
}

bindEvent(document.getElementsByClassName('tasks')[0], 'click', function (e) {
  var evt = getEventTarget(e);
  if (evt && hasClass(evt, 'btn-danger')) {
    addListener(evt);
  }
  if (evt && hasClass(evt, 'btn-primary')) {
    openModal(evt);
  }
  if (evt && hasClass(evt, 'btn-success')) {
    completed(evt);
  }
});

bindEvent(document.getElementsByClassName('theme-button')[0], 'click', addNew);

bindEvent(document.getElementsByClassName('reset-btn')[0], 'click', resetList);

bindEvent(document.getElementsByClassName('modal-close')[0], 'click', closeModal);

bindEvent(document.getElementsByClassName('error-close')[0], 'click', closeAlert);

bindEvent(document.getElementsByClassName('theme-button-close')[0], 'click', closeAlert);

bindEvent(document.getElementsByClassName('confirm-close')[0], 'click', closeConfirm);

bindEvent(document.getElementById('task-name'), 'keypress', function (e) {
  var x = e.keyCode;
  if (x == 13) {
    addNew();
  }
});

bindEvent(document.body, 'keydown', function (e) {
  var evt = e || window.event;
  var y = evt.which || evt.keyCode || 0;
  if (y == 27) {
    closeAlert();
    closeConfirm();
    closeModal();
  }
});


let srt1 = document.querySelector(".srt1")
let srt2 = document.querySelector(".srt2")
srt2.style.display = "none"
srt1.addEventListener("click", () => {
  srt2.style.display = "block"
  srt1.style.display = "none"
})
srt2.addEventListener("click", () => {
  srt1.style.display = "block"
  srt2.style.display = "none"
})


let close_search = document.querySelector('#close_search')
let search_input = document.getElementById('search_list_tasks_input')
search_input.addEventListener('input', (event) => {
  let list_into_ul = document.querySelectorAll('#myUl li')
  list_into_ul.forEach((li) => {
    (li.innerText.toLowerCase().includes(event.target.value.toLowerCase())) ?
      li.style.display = 'block' : li.style.display = 'none'
  })
})