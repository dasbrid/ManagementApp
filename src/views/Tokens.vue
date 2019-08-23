<template>
  <div class="hello">
  
   <H1 v-if="dataLoaded==false">
     Loading Token Information
   </h1>
   <b-container v-if="dataLoaded==true" fluid>
    <b-row class="my-2">
      <b-col md="12">
         <h1>Token Management</h1>
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col md="6">
        <b-form-group label-cols-sm="3" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-button @click="newToken()">New Token</b-button>
      </b-col>
    </b-row>
    <b-row class="my-2">
    <b-table 
    id="tokens-table"
    bordered striped hover :items="tokenslist" :fields="fields"
      show-empty
      stacked="md"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :filter="filter"
      @filtered="onFiltered"

    >

    <template slot="name" slot-scope ="row">
     <b-link @click.native="viewTokenDetails(row.item.id)">{{row.item.tokenName}}</b-link>
    </template>

    <template slot="operations" slot-scope ="row">
        <ul>
            <li v-for="(operation, index) in row.item.operations" :key=index>
                {{operation.description}}
            </li>
        </ul>
    </template>

    <template slot="actions" slot-scope ="row">
      <b-button size="sm" @click="showConfirmDelete(row.item.id)">
      delete
      </b-button>
    </template> 

    </b-table>
    </b-row>
    <b-row class="my-2">
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="tokens-table"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
  </div>

</template>

<script>
/* eslint-disable no-console */
import axios from "axios"; // for calling APIs

export default {
  name: 'Tokens',
  data() {
    return {
      // used to parameterise table display
      currentPage: 1,
      totalRows: 1,
      perPage: 6,
      pageOptions: [5, 10, 15],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      dataLoaded:false,
      
      tokenslist: null,
      fields: [
          { key: 'name', label:  'Description', sortable: true, sortDirection: 'desc' },
          { key: 'tokenString', label: 'Token String'},
          { key: 'operations', label: 'Token operations' },
          { key: 'actions', label: 'Actions' }
      ]
    }
  },
  components: {
    // an imported components.
},
  computed: {
        // Computed props go here
        // Transform 'tokens' to display in a table
        // e.g. Turn array of operations into comma separated list 
  },
  props: {
    msg: String
  },
    mounted () {
        this.fetchTokens();
  },
  methods: {
          onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      showConfirmDelete(id) {
        this.$bvModal.msgBoxConfirm('Are you sure?')
          .then(value => {
            if (value == true)
            {
              this.deleteToken(id)
            }
          })
      },
              showMsgBoxOne() {
        this.boxOne = ''
        this.$bvModal.msgBoxConfirm('Are you sure?')
          .then(value => {
            this.boxOne = value
          })
      },
    fetchTokens() {
    axios.get ("https://localhost:5001/api/tokens/en")
    .then(response => {
        console.log(response);
        this.tokenslist = response.data;
        this.totalRows = this.tokenslist.length
        this.dataLoaded = true
    })
    .catch(error=> {
        console.log(error);
    })
    },
    viewTokenDetails(id) {
      this.$router.push('token/' + id)
    },
    newToken() {
      this.$router.push('newtoken/')
    },
    deleteToken(id) {
      axios.delete ("https://localhost:5001/api/tokens/"+id).then(response => {
                console.log(response);
                this.fetchTokens();
            })
            .catch(error=> {
                console.log(error);
            })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  text-align: left
}
h1 {
  text-align: center
}

</style>