document.addEventListener('DOMContentLoaded', () => {
    loadItems(1);
    loadItems(2);
    loadItems(3);
    addEnterKeyListener(1);
    addEnterKeyListener(2);
    addEnterKeyListener(3);
});

function addItem(boxNumber) {
    const input = document.getElementById(`input${boxNumber}`);
    const list = document.getElementById(`list${boxNumber}`);
    const itemText = input.value.trim();
    if (itemText === '') return;

    const currentItems = list.getElementsByTagName('li');
    if (currentItems.length >= 19) {
        alert('Maximum of 19 items per box.');
        const inputGroup = document.getElementById(`input-group${boxNumber}`);
        inputGroup.style.display = 'none';
        return;
    }

    const listItem = createListItem(itemText, false);
    list.appendChild(listItem);
    saveItem(boxNumber, itemText, false);
    input.value = '';
}

function createListItem(text, completed) {
    const listItem = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'button-circle';
    button.classList.toggle('active', completed);

    const span = document.createElement('span');
    span.textContent = text;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    
    listItem.addEventListener('click', () => toggleItem(listItem, button, deleteButton));

    deleteButton.onclick = () => deleteItem(listItem, span.textContent);

    listItem.appendChild(button);
    listItem.appendChild(span);
    listItem.appendChild(deleteButton);
    
    if (completed) {
        span.style.textDecoration = 'line-through';
        span.style.color = '#555555';
        deleteButton.style.color = 'red'
    }

    return listItem;
}

function toggleItem(listItem, button, deleteButton) {
    const span = listItem.querySelector('span');
    const completed = button.classList.toggle('active');
    span.style.textDecoration = completed ? 'line-through' : 'none';
    span.style.color = completed ? '#555555' : '#FFFFFF';
    deleteButton.style.color = completed ? 'red' : '#202325';

    const boxNumber = listItem.parentNode.id.slice(-1);
    updateItem(boxNumber, span.textContent, completed);
}

function saveItem(boxNumber, text, completed) {
    const items = JSON.parse(localStorage.getItem(`box${boxNumber}`)) || [];
    items.push({ text, completed });
    localStorage.setItem(`box${boxNumber}`, JSON.stringify(items));
}

function loadItems(boxNumber) {
    const list = document.getElementById(`list${boxNumber}`);
    const items = JSON.parse(localStorage.getItem(`box${boxNumber}`)) || [];
    items.forEach(item => {
        const listItem = createListItem(item.text, item.completed);
        list.appendChild(listItem);
    });

    const inputGroup = document.getElementById(`input-group${boxNumber}`);
    if (items.length >= 19) {
        inputGroup.style.display = 'none';
    } else {
        inputGroup.style.display = 'flex';
    }
}

function updateItem(boxNumber, text, completed) {
    const items = JSON.parse(localStorage.getItem(`box${boxNumber}`)) || [];
    const index = items.findIndex(item => item.text === text);
    if (index !== -1) {
        items[index].completed = completed;
        localStorage.setItem(`box${boxNumber}`, JSON.stringify(items));
    }
}

function deleteItem(listItem, text) {
    const boxNumber = listItem.parentNode.id.slice(-1);
    listItem.remove();

    let items = JSON.parse(localStorage.getItem(`box${boxNumber}`)) || [];
    items = items.filter(item => item.text !== text);
    localStorage.setItem(`box${boxNumber}`, JSON.stringify(items));

    const inputGroup = document.getElementById(`input-group${boxNumber}`);
    inputGroup.style.display = 'flex';
}

function deleteItems(boxNumber) {
    const list = document.getElementById(`list${boxNumber}`);
    list.innerHTML = '';
    localStorage.removeItem(`box${boxNumber}`);
    const inputGroup = document.getElementById(`input-group${boxNumber}`);
    inputGroup.style.display = 'flex';
}

function addEnterKeyListener(boxNumber) {
    const input = document.getElementById(`input${boxNumber}`);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem(boxNumber);
        }
    });
}
