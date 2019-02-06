// JavaScript Document

//POST Di Creazione ToDo
//PUT di modifica di ToDo in base all'id
//GET lettura di tutti i ToDo filtrata per utente
//GET lettura di tutti gli utenti disponibili
//GET lettura di tutti i ToDo filtrata per stato di completamento
//DELETE Cancellazione di un ToDo


// 1) CREAZIONE DI METODO PER AGGIUNGERE USER: addUser()

// 2) GET:  Cerca Parola dentro  NAME o dentro  DESCRIPTION E MOSTRA I TODO

var app = new Vue({

	el: "#app",

	data: {
		message: "Hello Vue! By Margherita",
		toggle: true,
		id: "",
		search:'',
		str:'',
		users: [],
		newUser: '',
		list: [],
		list_deleted: [],
		list_filtered: "",
		list_completed: "",
		name: "",
		description: "",
		completed: "",
		assignedTo: "",
		
		listToDo:[]

	},

	methods: {


		// addUser: function (newUser) 
       
		addUser: function () { 

			for (var item of this.users) {
				if (this.users.indexOf(this.newUser) === -1) {
					this.users.push(this.newUser);
					console.log(this.users);
					//return this.users;
					return this.newUser;
				} else {
					return "User esistente";
				}
			}
			
		},
		
		
// CREA NUOVO USER

		createNewUser: function () { //this.newUser// this.addUser()

			this.$http.post('http://localhost:3001/users', this.newUser)
			
			.then((response) => {
					console.log(response);
					//this.showUsers().push(this.newUser);
					this.users.push(this.newUser);
					
				})
				.catch(error => {
					console.log(error);
				});
		},


// AGGIUNGI TO DO 
		addToDo: function () {
			this.$http.post('http://localhost:3001/list', {

					name: this.name,
					description: this.description,
					completed: this.completed,
					assignedTo: this.assignedTo

				})
				.then(response => {
					console.log(response);
				})
				.catch(error => {
					console.log("post error", error);
				});
		},
		

// NON FUNZIONA
		//searchString: function () {
//
//			fetch('http://localhost:3001/list?name=' + this.str)
//				.then((response) => {
//					return response.json();
//				})
//				.then((response) => {
//					this.list = response;
//					return this.list.filter(obj => obj.name.includes(this.str));
//
//				})
//				.catch(function (err) {
//					console.log("err:", err);
//				});
//
//		},
		
		
// Carica tutti i ToDo

		loadToDo() {
			fetch('http://localhost:3001/list')
				.then((response) => {
					return response.json();
				})
				.then((response) => {
					this.list = response;
					for (var toDo of this.list) {
						toDo.visible = true;
					}
				})
				.catch(function (err) {
					console.log("err:", err);
				});
			
		},
		
		
		deleteToDo: function () {
			var url = 'http://localhost:3001/list_deleted/' + this.id;
			this.$http.delete(url).then(response => {
				this.list = response.body;
				//console.log(response.body);
			});

		},

		showUsers: function () {
			var url = 'http://localhost:3001/users';
			this.$http.get(url).then(response => {

				for (var user of this.users) {
					user.visible = true;
				}
				this.users = response.body;
				return this.users;
			});
		},

		readListByUser: function () {
			this.$http.get('http://localhost:3001/list_filtered?assignedTo=' + this.assignedTo)

			.then(response => response.json())
				.then(response => {
					this.list_filtered = response;
					console.log(response.body);
				});

		},

		readListByState: function () {
			this.$http.get('http://localhost:3001/list_completed?completed=' + this.completed)

			.then(response => response.json())
				.then(response => {
					this.list_completed = response;
					console.log(response.body);
				});

		},

		//this.$http.put(url, { completed: this.completed}: le parentesi graffe dopo "url", costituiscono il "body" del client

		changeStateById: function () {
			var url = 'http://localhost:3001/list/' + this.id;
			this.$http.put(url, {
				completed: this.completed
			}).then(response => {
				this.loadToDo(); // questa funzione mi ritorna tutti i ToDo, con la modifica effettuata
			});

		},

		//// aggiungo funzione reset
		
		resetAll: function () {
			var url = 'http://localhost:3001/list/';
			this.$http.get(url).then(response => {
				
				return this.list=[];
				console.log(response.body);
			});
		}
		
	},
	
	computed: {
    // CERCA STRINGA DENTRO NAME O DESCRIPTION
		
		  filteredList() {
		  	return this.list.filter(post => {
		  		return post.name.toLowerCase().includes(this.search.toLowerCase())||
					post.description.toLowerCase().includes(this.search.toLowerCase());
		  	})
		  },
 

		
  },


	created: function () {
		this.deleteToDo();
		this.addToDo();
		this.loadToDo();
		this.showUsers();
		this.readListByUser();
		this.readListByState();
		this.changeStateById();
		this.createNewUser();
		//this.searchString();
		this.filteredList()
	}


});
