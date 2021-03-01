import { LightningElement, track, api, wire } from 'lwc';
import saveStudent from '@salesforce/apex/studentDetailsController.saveStudent';
import contactFieldSet from '@salesforce/apex/studentDetailsController.getContactList';

import {NavigationMixin} from 'lightning/navigation';
import retrieveObjectFields from '@salesforce/apex/studentDetailsController.retrieveObjectFields';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


export default class StudentLwcComponent extends NavigationMixin (LightningElement) {

    @track sObjectName =  'Contact';
    @track fieldSetList;
    @track fieldSetvalue;
    @api allFieldSetList;

    @api fieldInput;
    @track firstName;
    @track lastName;
    @track phoneNumber;
    @track email;
    @track address;
    @track dob;
    @track contactId;
    @track loadMoreStatus;
    @api totalNumberOfRows;
    tableElement
    maxRows = 5;
    tableElement;
    @track rowNumberOffset; //Row number
    
    @track page = 1; //this will initialize 1st page
    // @track items = []; //it contains all the records.
    @track data = []; //data to be displayed in the table
    // @track columns = columns; //holds column info.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 5; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records

    @track contactRecord=[];
    @api error;
    @api recordId;
    
    // @wire(contactFieldSet, { contactId: '$recordId' })
    @wire(contactFieldSet, {
        fieldSetName : 'StudentDetails',
        ObjectName : 'Contact'
    })
    wiredContacts({ error, data }) {
        if (data) {
         this.contactRecord = data;
        this.data = data;
         var tempOppList = [];  
         for (var i = 0; i < data.length; i++) {  
          let tempRecord = Object.assign({}, data[i]); //cloning object  
          tempRecord.LastName = "/" + tempRecord.Id;
          tempRecord.AccountName = "/" + tempRecord.Account.Id;

          tempOppList.push(tempRecord);  
         }  
    
         this.contactRecord = tempOppList; 

         this.totalRecountCount = data.length; //here it is 23
         this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
           
           //initial data to be displayed ----------->
           //slice will take 0th element and ends with 5, but it doesn't include 5th element
           //so 0 to 4th rows will be displayed in the table
           this.data = this.contactRecord.slice(0,this.pageSize); 
           this.endingRecord = this.pageSize;
        
           this.error = undefined;
                
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
        
        saveContact(){
             let cont = {'sobjectType' : 'Contact'};
            const fields = this.template.querySelectorAll('lightning-input-field');
           
            const defaultValues = {};
            for (let i = 0; i < fields.length; i++) {
                let singleField = fields[i];
                let fieldName = singleField.fieldName;
                
                if(singleField.value != 'null'){
                    defaultValues[fieldName] = singleField.value;
                }
            }
            this.fieldsValues = defaultValues;
           
            cont = this.fieldsValues;

            saveStudent({objStudent: cont})
            .then(result => {
                this.recordId = result;
             
                this.dispatchEvent(new ShowToastEvent({
                                        title: 'Success!!',
                                        message: 'Contact record has been Created/Updated Successfully!!',
                                        variant: 'success',
                                    }), );
                //Start namvigation
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: 'Contact',
                        actionName: 'view'
                    },
                 });
                 //End navigation

            })
            .catch(error => {
                this.error = error.message;
            }); 
        }
    

    @wire(retrieveObjectFields, {
        fieldSetName : 'StudentDetails',
        ObjectName : 'Contact' ,
        ParentObject: 'Account'
    } )
    listFieldName(result) {
        
        if (result.data) {
            this.allFieldSetList = result.data;
        } 
        else if (result.error) {

            this.error = result.error;
            this.allFieldSetList = undefined;
        }
    }

    //Refresh the input fields of record-edit form
    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
     }

    handleStudentChange = (evt) => {
        let field_name = evt.target.name;
        if(field_name === 'fieldInput')
        {
            this.fieldInput = evt.target.value; 
        }
               
    }

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        } 
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
        page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
        so, slice(5,10) will give 5th to 9th records.
        */
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.contactRecord.slice(this.startingRecord, this.endingRecord);

        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
    } 
    
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
       
        switch (actionName) {
    
        case 'view':
            this.viewRecord(row);
            break;
        default:
            this.viewRecord(row);
            break;
        }
    }

    viewRecord(row) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'view',
            },
        });
    }
}