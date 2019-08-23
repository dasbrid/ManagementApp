<template>
<div>
   <H1 v-if="dataLoaded==false">
     Loading Token Information
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
        
            <b-form-input v-model="newName" placeholder="description"></b-form-input>
        </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col md="12">
         <h3>Operations</h3>
      </b-col>
    </b-row>
               
        <b-row v-for="(operation, index) in alloperations" :key="index">
        <b-col md="12">
            <label>
            <input type="checkbox" id="operation.id" :value="operation.id" v-model="checkedOperations"> {{operation.description}}
            </label>
        </b-col>
        </b-row>
    <b-row class="my-2">
    <b-col md="2">
        <b-button @click="updateToken">update</b-button>
    </b-col>        
    <b-col md="2">
        <b-button @click="goBack">Back</b-button>
        </b-col>
    <b-col md="2">
        <b-button @click="showConfirmDelete">Delete</b-button>
    </b-col>
    </b-row>
    </b-container>
    </div>
</template>
<script>
/* eslint-disable */
import axios from "axios"
import { stringify } from 'querystring';
export default {
    name: 'Tokendetails',

    data () {
        return {
            checkedOperations: [],
            alloperations: null,
            tokenInfo : null,
            dataLoaded: false,
            newName: null,
            newBody: null
        }
    },
    mounted () {
        axios.get ("https://localhost:5001/api/tokens/en/" + this.id)
        .then(response => {
            this.tokenInfo = response.data;

            // Set the checkboxes depending on the token's operations    
            for (let i = 0; i < this.tokenInfo.operations.length; i++) {
                console.log("operation " + i + "=" + this.tokenInfo.operations[i].id)
                this.checkedOperations[i] = this.tokenInfo.operations[i].id
            }
            this.newName = this.tokenInfo.tokenName
            this.dataLoaded = true;
            
        })
        .catch(error=> {
            console.log(error);
        })
        
        axios.get ("https://localhost:5001/api/operations/en/")
        .then(response => {
            console.log(response);
            this.alloperations = response.data;
        })
        .catch(error=> {
            console.log(error);
        })        
    },
    methods: {
              showConfirmDelete() {
        this.$bvModal.msgBoxConfirm('Are you sure?')
          .then(value => {
            if (value == true)
            {
              this.deleteToken()
            }
          })
          .catch(err => {
            // An error occurred
          })
      },
          deleteToken() {
            var id = this.tokenInfo.id
      axios.delete ("https://localhost:5001/api/tokens/"+id).then(response => {
                console.log(response);
                this.$router.go(-1);
            })
            .catch(error=> {
                console.log(error);
            })
    },
        goBack() {
            this.$router.go(-1);
        },
        updateToken() {

            // Fill in the operations array depending on what is checked
            let operations = []
            for (let i = 0; i < this.checkedOperations.length; i++)
            {
                operations[i] = {id:+this.checkedOperations[i]}
            }

            axios.put("https://localhost:5001/api/tokens/" + this.id,
            {
                id: this.id,
                name: this.newName,
                operations:operations

            })
            .then(response => {
                console.log(response);
                this.$bvModal.msgBoxOk('Token Updated')
            })
            .catch(error=> {
                console.log("Error"+ error);
                this.$bvModal.msgBoxOk('Something went wrong :(')
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
