<template>
    <div>
   <H1 v-if="dataLoaded==false">
     Please wait ...
   </h1>
   <b-container v-if="dataLoaded==true" fluid>
    <b-row class="my-2">
      <b-col md="12">
         <h1>Token Details</h1>
      </b-col>
    </b-row>
        <b-row class="my-2">
      <b-col md="12">
         <h3>Token description</h3>
      </b-col>
    </b-row>
        <b-row>
    <b-col md="6" class="my-1">
        
            <b-form-input v-model="tokenName" placeholder="description"></b-form-input>
        </b-col>
    </b-row>
 
    <b-row class="my-2">
      <b-col md="12">
         <h3>Operations</h3>
      </b-col>
    </b-row>
    <b-row class="my-2">
        <b-col md="12">
            <b-table bordered striped hover :items="alloperations" :fields="fields"
                show-empty
                stacked="md"
        >

            <template slot="selected" slot-scope="row">
                <b-form-checkbox v-model="row.value" @change="toggleSelected(row.item.id)">
                </b-form-checkbox>
            </template>
            </b-table>
        </b-col>
    </b-row>
    <b-row>
      <b-col md="3" class="my-1">
            <b-button @click="storeToken()" :disabled="!canStore">Store</b-button>
      </b-col>
      <b-col md="3" class="my-1">
            <b-button @click="goBack()">Cancel</b-button>
      </b-col>
    </b-row>
</b-container>    
     </div>

</template>
<script>
/* eslint-disable */
import axios from "axios"
//import { stringify } from 'querystring';
//import { isJSXClosingElement } from '@babel/types';
export default {
    
    name: 'newToken',
    
    data () {
        return {
            checkedOperations: [],
            alloperations: null,
            tokenInfo : null,
            tokenName: null,
            newBody: null,
            dataLoaded: false,
            // for table
      fields: [
          { key: 'name', label:  'Name', sortable: true, sortDirection: 'desc' },
          { key: 'description', label: 'Description'},
          { key: 'selected', label: 'Selected' }
            ]
        }
    
    },
computed: {
        // Computed props go here
        canStore() {
            if (!this.tokenName) {
                return false
            }
            if (this.checkedOperations.length == 0)            
            {
                return false
            }
            return true
        }
    },
    mounted () {
       axios.get ("https://localhost:5001/api/operations/en/")
        .then(response => {
            console.log(response.data)
            
            let data = response.data
            // Using the response data - list of all possible tokens - create a 
            // list to be used in displaying the table.
            // This simply adds a "selected" property
            this.alloperations = data.map((operation)=>{
            let tmp=operation;
            tmp.selected = false;
            
            return tmp;
            })
            this.dataLoaded = true      
        })
        .catch(error=> {
            console.log(error)
        })    },
    methods: {
        // toggle the state of token with this id
        // checkedOperations is an array with each entry equal 
        // to the id of a  selectd token
       toggleSelected(id) {
         // first find out if thi id is checked:
         // find if it is present in our array, and if so at what position
         let ischecked = false
         let i = 0
         for (; i<this.checkedOperations.length; i++)
         {
             if (this.checkedOperations[i] == id) {
                 ischecked = true;
                 break;
             }
         }
         if (ischecked == false)
         {
            // if the id is not currently in the array, add it
            this.checkedOperations.push(id)
         } else {
             // the id is currently in the array at positing i ... remove it
             this.checkedOperations.splice(i, 1);
         }
},
        goBack() {
            this.$router.go(-1);
        },
        storeToken() {

            // Fill in the operations array depending on what is checked
            let operations = []
            
            for (let i = 0; i < this.checkedOperations.length; i++)
            {
                operations[i] = {id:+this.checkedOperations[i]}
            }
            axios.post("https://localhost:5001/api/tokens/",
            {
                tokenname: this.tokenName,
                operations:operations

            })
            .then(response => {
                console.log(response);
                this.$router.go(-1);
            })
            .catch(error=> {
                console.log(error);
            })
        },
    },
    props: {
        id:  String,
    }
    
}

</script>
<style scoped>

</style>
