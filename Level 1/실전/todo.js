const todoInputElem = document.querySelector('.todo-input'); // 할일 입력창 요소를 선택
const todoListElem = document.querySelector('.todo-list'); // 할일 목록을 담은 요소를 선택
const completeAllBtnElem = document.querySelector('.complete-all-btn'); // 모두 완료 버튼 요소를 선택
const leftItemsElem = document.querySelector('.left-items') // 남은 할일 개수를 표시하는 요소를 선택
const showAllBtnElem = document.querySelector('.show-all-btn'); // 모든 할일 보기 버튼 요소를 선택
const showActiveBtnElem = document.querySelector('.show-active-btn'); // 완료되지 않은 할일 보기 버튼 요소를 선택
const showCompletedBtnElem = document.querySelector('.show-completed-btn'); // 완료된 할일 보기 버튼 요소를 선택
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn'); // 완료된 할일 지우기 버튼 요소를 선택

let id = 0;
const setId = (newId) => {id = newId};

let isAllCompleted = false; 
const setIsAllCompleted = (bool) => { isAllCompleted = bool};

let currentShowType = 'all';
const setCurrentShowType = (newShowType) => currentShowType = newShowType

let todos = [];
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => {
    return todos; // 모든 할일 목록을 반환하는 함수
}
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true ); // 완료된 할일 목록을 반환하는 함수
}
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false); // 완료되지 않은 할일 목록을 반환하는 함수
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} items left` // 남은 할일 개수를 표시하는 함수
}

const completeAll = () => {
    completeAllBtnElem.classList.add('checked'); // 모든 할일을 완료 상태로 표시하는 클래스를 추가
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )
    setTodos(newTodos) // 모든 할일을 완료 상태로 설정하는 함수
}

const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked'); // 모든 할일을 미완료 상태로 표시하는 클래스를 제거
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );
    setTodos(newTodos) // 모든 할일을 미완료 상태로 설정하는 함수
}

const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true); // 모든 할일이 완료되었다면 isAllCompleted를 true로 설정
        completeAllBtnElem.classList.add('checked'); // 모든 할일 완료 버튼에 'checked' 클래스를 추가
    } else {
        setIsAllCompleted(false); // 아니라면 isAllCompleted를 false로 설정
        completeAllBtnElem.classList.remove('checked'); // 모든 할일 완료 버튼에서 'checked' 클래스를 제거
    }
}
const onClickCompleteAll = () => {
    if(!getAllTodos().length) return; // 할일이 없다면 함수를 종료
    if(isAllCompleted) incompleteAll();  // 모든 할일이 완료되었다면 미완료 상태로 변경
    else completeAll(); // 그렇지 않다면 모든 할일을 완료 상태로 변경
    setIsAllCompleted(!isAllCompleted); // isAllCompleted 값을 반전
    paintTodos(); // 할일을 다시 작성
    setLeftItems() // 남은 할일 개수를 업데이트
}

const appendTodos = (text) => {
    const newId = id + 1;
    setId(newId)
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
    setTodos(newTodos)
    setLeftItems()
    checkIsAllCompleted();
    paintTodos();
}

const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    setLeftItems()
    paintTodos()
}

const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
    setLeftItems()
    checkIsAllCompleted();
}

const updateTodo = (text, todoId) => {
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');
    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener('click', onClickBody );
        }
    })

    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)
    todoItemElem.appendChild(inputElem);
}

const clearCompletedTodos = () => {
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    paintTodos();
}

const paintTodo = (todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    todoItemElem.setAttribute('data-id', todo.id );

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id))
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);
    todoListElem.appendChild(todoItemElem);
}

const paintTodos = () => {
    todoListElem.innerHTML = '';

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo);});
            break;
        default:
            break;
    }
}

const onClickShowTodosType = (e) => {
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;

    if ( currentShowType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');
    currentBtnElem.classList.add('selected')
    setCurrentShowType(newShowType)
    paintTodos();
}

const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoInputElem.value ='';
        }
    })
    completeAllBtnElem.addEventListener('click',  onClickCompleteAll); // 모든 할일 완료 버튼에 클릭 이벤트 리스너를 추가
    showAllBtnElem.addEventListener('click', onClickShowTodosType); // 모든 할일 보기 버튼에 클릭 이벤트 리스너를 추가
    showActiveBtnElem.addEventListener('click',onClickShowTodosType); // 완료되지 않은 할일 보기 버튼에 클릭 이벤트 리스너를 추가
    showCompletedBtnElem.addEventListener('click',onClickShowTodosType); // 완료된 할일 보기 버튼에 클릭 이벤트 리스너를 추가
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos); // 완료된 할일 지우기 버튼에 클릭 이벤트 리스너를 추가
    setLeftItems() // 남은 할일 개수를 초기화
}

init()//초기화 함수 출력