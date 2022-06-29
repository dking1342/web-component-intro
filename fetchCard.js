const templateFetch = document.createElement("template");
templateFetch.innerHTML = `
  <div class="fetch-container">
    
  </div>
`;

class FetchCard extends HTMLElement {
  constructor(){
    super();
    this.state = [];
    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(templateFetch.content.cloneNode(true));
    this.url = this.getAttribute("url");
  }

  async fetchData(){
    try {
      const response = await fetch(this.url);

      if(response.ok){
        const data = await response.json();      
  
        // create list
        if(data.length){
          this.state = data.slice(0,9);
          this.createList(this.state);
        }
      } else {
        alert("Error when fetching. Please try again");
      }

    } catch (error) {
      console.error(error);
      alert("Error when fetching. Please try again");
    }
  }

  createList(state){
    let container = this.shadowRoot.querySelector(".fetch-container");
    container.innerHTML = "";
    
    state.forEach(todo => {
      const card = document.createElement("div");
      const title = document.createElement("span");
      const checkbox = document.createElement("input");
      const button = document.createElement("button");
      checkbox.type = "checkbox"

      card.dataset.key = todo.id;
      title.innerText = todo.title;
      checkbox.checked = todo.completed;
      checkbox.onchange = () => this.toggleCompleted(todo);

      if(checkbox.checked){
        title.style.color="grey"
        title.style.textDecoration="line-through"
      }

      card.append(title);
      card.append(checkbox);

      container.append(card);
    })
  }

  toggleCompleted(todo){
    const toggledTodo = {
      ...todo,
      completed:!todo.completed
    }
    const toggledState = this.state.map(item => {
      if(item.id === todo.id){
        return toggledTodo
      } else {
        return item;
      }
    })
    this.state = toggledState;
    this.createList(this.state);
  }

  connectedCallback(){
    window.addEventListener("DOMContentLoaded", e => {
      this.fetchData()
    });
  }
  
  disconnectedCallback(){
    window.removeEventListener();
  }
}

window.customElements.define("fetch-card",FetchCard);
