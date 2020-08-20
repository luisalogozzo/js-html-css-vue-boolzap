Vue.config.devtools = true;

var app = new Vue(
  {
    el: '#app',
    data: {
      contactSearch: "",
      newMessage: "",
      activeContact: 0,
      activeDropdown: null,
      popupPosition: null,
      contacts: [
        {
          image: "avatar_1.png",
          name: 'Serena',
          text: "Ciao come stai?",
          lastTime: moment('14/08/2020 11:08:00', 'DD/MM/YYYY hh:mm:ss'),
          visible: true,
          chat: [
            {
              text: "Ciao come stai?",
              time: moment('14/08/2020 11:08:00', 'DD/MM/YYYY hh:mm:ss'),
              sent: true
            }
          ]
        },
        {
          image: "avatar_2.png",
          name: 'Fabio',
          text: "Tutto ok?",
          lastTime: moment('14/08/2020 10:02:00', 'DD/MM/YYYY hh:mm:ss'),
          visible: true,
          chat: [
            {
              text: "Tutto ok?",
              time: moment('14/08/2020 10:02:00', 'DD/MM/YYYY hh:mm:ss'),
              sent: false
            }
          ]
        },
        {
          image: "avatar_4.png",
          name: 'Ludovica',
          text: "Hey",
          lastTime: moment('14/08/2020 09:01:00', 'DD/MM/YYYY hh:mm:ss'),
          visible: true,
          chat: [
            {
              text: "Hey",
              time: moment('14/08/2020 09:01:00', 'DD/MM/YYYY hh:mm:ss'),
              sent: true
            }
          ]
        },
        {
          image: "avatar_3.png",
          name: 'Federico',
          text: "Ci vediamo questo sabato?",
          lastTime: moment('14/08/2020 07:10:00', 'DD/MM/YYYY hh:mm:ss'),
          visible: true,
          chat: [
            {
              text: "Ci vediamo questo sabato?",
              time: moment('14/08/2020 07:10:00', 'DD/MM/YYYY hh:mm:ss'),
              sent: false
            }
          ]
        },
      ]
    },
    methods: {
      chatsearch() {
        var text = this.contactSearch.toLowerCase().trim();
        for (var i = 0; i < this.contacts.length; i++) {
          if (this.contacts[i].name.toLowerCase().search(text)) {
            this.contacts[i].visible = false;
          } else {
            this.contacts[i].visible = true;
          }
        }

      },
      SyncText(i) {
        var ChatListLength = this.contacts[i].chat.length;
        this.contacts[i].text = this.contacts[i].chat[ChatListLength - 1].text;
      },
      SendMessage() {
        var ref = this;
        var newMsg = {
          text: this.newMessage,
          time: moment(),
          sent: true
        };
        // console.log(this.$el.querySelector(".chat-messages li:last-child").getBoundingClientRect());
        this.contacts[this.activeContact].lastTime = newMsg.time;
        this.contacts[this.activeContact].chat.push(newMsg);
        var thisContact = this.contacts[this.activeContact];
        setTimeout(() => this.scrollToEnd(), 1);
        this.OrganizeChatList(thisContact);
        setTimeout(function(){
          ref.receiveMessage(thisContact);
        }, 1500);
       this.newMessage = "";
      },
      receiveMessage(thisContact) {
        var newMsg = {
          text: this.CreateRandomSentences(),
          time: moment(),
          sent: false
        };
        var newMsgTime = newMsg.time;
        this.contacts[this.activeContact].lastTime = newMsg.time;
        thisContact.chat.push(newMsg);
        setTimeout(() => this.scrollToEnd(), 1);
        this.OrganizeChatList(thisContact);
      },
      scrollToEnd: function() {
        var container = this.$el.querySelector(".chat-messages");
        container.scrollTop = container.scrollHeight;
      },
      CreateRandomSentences() {
        var RandSentences = [
          'Se c’è un rimedio, perché te la prendi? E se non c’è un rimedio, perché te la prendi?',
          'Ci sono tre verità: la mia verità. la tua verità, e la verità.',
          'Se le vostre parole non sono migliori del silenzio, dovreste restare zitti.',
          'Incontrare un amico dopo tanti anni è come godersi una  pioggia rinfrescante dopo un periodo di siccità',
          'Ho l\'orologio che va avanti di tre ore ma non sono mai riuscito ad aggiustarlo. Così da Los Angeles mi sono trasferito a New York.',
          'Quando ero piccolo i miei genitori mi volevano talmente bene che mi misero nella culla un orsacchiotto. Vivo.'
        ];

        var RandNum = Math.floor(Math.random() * RandSentences.length);
        var RandSentence = RandSentences[RandNum];

        return RandSentence;
      },
      OrganizeChatList(thisContact) {
        var ChatListLength;
        ChatListLength = thisContact.chat.length;

        thisContact.lastTime = thisContact.chat[ChatListLength - 1].time;
        var thisContactIndex = this.contacts.indexOf(thisContact);
        this.contacts.splice(thisContactIndex, 1);
        var trovato = false;
        var i = 0;
        do {
          if (thisContact.lastTime.isAfter(this.contacts[i].lastTime) || this.contacts[i].lastTime < 1) {
            this.contacts.splice(i, 0, thisContact);
            if (thisContact.chat[ChatListLength - 1].sent) {
              this.activeContact = i;
            }
            this.SyncText(i);
            trovato = true;
          }
          i++;
        } while (i < this.contacts.length && trovato == false);
        if (trovato == false) {
          this.contacts.push(thisContact);
          if (thisContact.chat[ChatListLength - 1].sent) {
            this.activeContact = i;
          }
          this.SyncText(i);
        }
      },
      deleteMessage(index, i) {
        this.contacts[index].chat.splice(i, 1);
        if (this.contacts[index].chat.length >= 1) {
          this.OrganizeChatList(this.contacts[index]);
        } else {
          this.contacts[index].lastTime = ' ';
          this.contacts[index].text = ' ';
          this.contacts.splice(this.contacts.length, 0, this.contacts[index]);
          this.contacts.splice(index, 1);
          this.activeContact = this.contacts.length - 1;
        }
      },
      closeDropdown(){
        if (this.activeDropdown != null) {
          this.activeDropdown = null;
        }
      },
      toggleDropdown(i) {
        var container = this.$el.querySelector(".chat-messages");
        // console.log(this.$el.querySelector(".chat-messages li:last-child").getBoundingClientRect());


        if (this.activeDropdown != null) {
          this.activeDropdown = null;
        } else {
          this.activeDropdown = i;

          var msgHeight = this.$el.querySelector(".chat-messages li:nth-child(" + (i+1) + ")").getBoundingClientRect().y;
          var chatHeight = this.$el.querySelector(".chat-messages").getBoundingClientRect().height;

           if (msgHeight > chatHeight - 60) {
             if (this.contacts[this.activeContact].chat[i].sent) {
               this.popupPosition = 'bottom-right';
             } else {
               this.popupPosition = 'bottom-left';
             }
           } else if (this.contacts[this.activeContact].chat[i].sent) {
             this.popupPosition = 'top-right';
           } else {
             this.popupPosition = 'top-left';
           }
        }
      }
    },
    mounted() {
      for (var i = 0; i < this.contacts.length; i++) {
        this.SyncText(i);
      }
    }
  }
);
