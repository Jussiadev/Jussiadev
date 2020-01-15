<template>
  <div class="hello">
    <b-container>
      <b-row>
        <b-col>
          <h1>VIEWING PAYEES OF ANDREY PANIN</h1>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <h3 class="float-left">Companies</h3>
        </b-col>
      </b-row>

      <b-table sticky-header hover :items="companiesItems" :fields="companiesFields">
      </b-table>
      <Popup
        v-if="!companiesItems.length"
        :title="'Add payee'"
        :modalId="'companies'"
        @handleOk="addPayee">
        <label for="payeeName">Name:</label>
        <b-form-input
          id="payeeName"
          v-model="payeeName"
          placeholder="Enter your name"
          trim
        ></b-form-input>
        <label for="payeeAddress">Address:</label>
        <b-form-input
          id="payeeAddress"
          v-model="payeeAddress"
          placeholder="Enter your address"
          trim
        ></b-form-input>
        <label for="payeeAccounts">Accounts:</label>
        <b-form-input
          id="payeeAccounts"
          v-model="payeeAccounts"
          placeholder="Enter your accounts"
          trim
        ></b-form-input>
      </Popup>

      <b-row>
        <b-col>
          <h3 class="float-left">Individuals</h3>
        </b-col>
      </b-row>

      <b-table
        sticky-header
        hover
        :items="individualsItems"
        :fields="individualsFields"
        selectable
        :select-mode="'single'"
      >
        <template v-slot:head(name)="data">
          <div>
            <span class="text-info" v-show="toggleField" @click="toggleField = !toggleField">{{ data.label.toUpperCase() }}</span>
            <input type="text" v-show="!toggleField" placeholder="search" @blur="toggleField = !toggleField">
          </div>
        </template>
        <template v-slot:cell(accounts)="data">
          <div>
            <span v-for="account in data.item.accounts" :key="account.id">
              <b-badge variant="info" :id="'popover-target-' + account.id">
               {{account.info.title}}
              </b-badge>
              <b-popover :target="'popover-target-' + account.id">
                <template v-slot:title>{{account.info.title}}</template>
                  <p>BC: {{account.info.bc}}</p>
                  <p>AN: {{account.info.an}}</p>
                <Popup
                  v-if="data.item.accounts.length >= 1"
                  :variant="'outline-danger'"
                  :title="'Delete'"
                  :modalId="'delete' + account.id"
                  :modal-header="'danger'"
                  :modal-header-text="'light'"
                  :btn-size="'sm'"
                  @handleHidden="pressModalCancel"
                  @handleOk="pressModalOk(account.id, data.item.id)"
                >
              <p>Are you sure?</p>
            </Popup>&nbsp;
                <b-button size="sm" variant="outline-success">
                  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=jussiadev%40gmail%2ecom&lc=US&button_subtype=services&no_note=0&currency_code=USD&bn=PP%2dBuyNowBF%3abtn_buynowCC_LG%2egif%3aNonHostedGuest">
                    Pay
                  </a>
                </b-button>
              </b-popover>
          </span>
            <Popup
              v-if="data.item.accounts.length === 1"
              :title="'Add account'"
              :modalId="'addAccount' + data.item.id"
              :btn-size="'sm'"
              @handleOk="addAccount(data.item.id)"
            >
              <label for="title">Title:</label>
              <b-form-input
                id="title"
                v-model="title"
                placeholder="Enter your title"
                trim
              ></b-form-input>
              <label for="bc">BC:</label>
              <b-form-input
                id="bc"
                v-model="bc"
                placeholder="Enter your BC"
                trim
              ></b-form-input>
              <label for="an">AN:</label>
              <b-form-input
                id="an"
                v-model="an"
                placeholder="Enter your AN"
                trim
              ></b-form-input>
            </Popup>

            <Popup
              v-if="data.item.accounts.length >= 1"
              :variant="'outline-danger'"
              :title="'Delete payee'"
              :modalId="'deletePayee' + data.item.id"
              :modal-header="'danger'"
              :modal-header-text="'light'"
              :btn-size="'sm'"
              @handleOk="deletePayee(data.item.id)"
            >
              <p>Are you sure?</p>
            </Popup>
          </div>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import Popup from './Popup'
export default {
  name: 'Index',
  components: {
    Popup
  },
  data () {
    return {
      toggleField: true,
      companiesFields: ['name', 'address', 'accounts'],
      companiesItems: [],
      individualsFields: [
        {
          key: 'name',
          label: 'First / last name',
          sortable: true
        },
        {
          key: 'address',
          sortable: false
        },
        {
          key: 'accounts',
          sortable: false
        }
      ],
      individualsItems: [
        {
          id: 1,
          name: 'Alexey Ivanov',
          address: 'Russia',
          accounts: [
            {
              id: 1,
              info: {
                title: 'ru',
                bc: '11-22-33',
                an: '123456789'
              }
            }
          ]
        },
        {
          id: 2,
          name: 'Boris Petrov',
          address: 'USA',
          accounts: [
            {
              id: 11,
              info: {
                title: 'ru',
                bc: '21-44-55',
                an: '64321112'
              }
            },
            {
              id: 12,
              info: {
                title: 'ua',
                bc: '22-44-55',
                an: '6756545'
              }
            },
            {
              id: 13,
              info: {
                title: 'gb',
                bc: '33-44-55',
                an: '454534535'
              }
            }
          ]
        }
      ],
      payeeName: '',
      payeeAddress: '',
      payeeAccounts: '',
      name: '',
      address: '',
      accounts: '',
      showPopover: false,
      title: '',
      bc: '',
      an: ''
    }
  },
  methods: {
    pressModalOk: function (id, index) {
      this.individualsItems[index - 1].accounts = this.individualsItems[index - 1].accounts.filter(x => {
        return x.id !== id
      })
      this.$root.$emit('bv::hide::popover')
    },
    pressModalCancel: function () {
      this.$root.$emit('bv::hide::popover')
    },
    addPayee: function () {
      let payee = {
        name: this.payeeName,
        address: this.payeeAddress,
        accounts: this.payeeAccounts
      }
      this.companiesItems.push(payee)
    },
    addAccount: function (id) {
      let account = {
        id: this.individualsItems[id - 1].id + 11,
        info: {
          title: this.title,
          bc: this.bc,
          an: this.an
        }
      }
      this.individualsItems[id - 1].accounts.push(account)
    },
    deletePayee: function (id) {
      this.individualsItems = this.individualsItems.filter(x => {
        return x.id !== id
      })
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
  text-decoration: none;
}
a:hover {
  color: white;
  text-decoration: none;
}
</style>
