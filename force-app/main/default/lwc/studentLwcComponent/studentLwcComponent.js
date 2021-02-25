import { LightningElement, track, api, wire } from 'lwc';
import saveStudent from '@salesforce/apex/studentDetailsController.saveStudent';
import contactFieldSet from '@salesforce/apex/studentDetailsController.getContactList';
// import contactFieldSet from '@salesforce/apex/studentDetailsController.getContacts';
// import contactFieldSet from '@salesforce/apex/studentDetailsController.getAccountList';
import NAME from '@salesforce/schema/Contact.LastName';
import {NavigationMixin} from 'lightning/navigation';
import retrieveObjectFields from '@salesforce/apex/studentDetailsController.retrieveObjectFields';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

  
// row actions
const actions = [
    { label: 'view', name: 'view'}, 
    { label: 'edit', name: 'edit'}, 
    { label: 'Delete', name: 'delete'}
];

// datatable columns with row actions
const columns = [
    { label: 'FirstName', fieldName: 'FirstName' }, 
    { label: 'LastName', fieldName: 'LastName' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone'}, 
    { label: 'Email', fieldName: 'Email', type: 'email' }, 
    { label: 'Account Name', fieldName: 'AccountName', type: 'text' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'right'
        }
    }
];


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

    
    @track page = 1; //this will initialize 1st page
    // @track items = []; //it contains all the records.
    @track data = []; //data to be displayed in the table
    @track columns = columns; //holds column info.
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
        ObjectName : 'Contact'
        // recToReturn : 10
    })
    wiredContacts({ error, data }) {
        if (data) {
            this.contactRecord = data;
           
           console.log('get records**********', this.contactRecord);

           console.log('get records**********', data);



        //    this.items = data;
           this.totalRecountCount = data.length; //here it is 23
           this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
           
           //initial data to be displayed ----------->
           //slice will take 0th element and ends with 5, but it doesn't include 5th element
           //so 0 to 4th rows will be displayed in the table
           this.data = this.contactRecord.slice(0,this.pageSize); 
           this.endingRecord = this.pageSize;
        //    this.data = data.map(record => {return{...record, 'AccountName': record.Account.Name, "AccountId": record.AccountId}});
            // this.data = data;
            this.data  =  data.map(
                record => Object.assign(
            { 'Account.Name': record.Account.Name},
            record
                )
             );
           this.error = undefined;
                
        } else if (error) {
            this.error = error;
            this.contactRecord = undefined;
        }
    }
        
        saveContact(){
             let cont = {'sobjectType' : 'Contact'};
            const fields = this.template.querySelectorAll('lightning-input-field');
            console.log('fields', fields);
            const defaultValues = {};
            for (let i = 0; i < fields.length; i++) {
                let singleField = fields[i];
                let fieldName = singleField.fieldName;
                console.log('node: ',singleField.fieldName);
                if(singleField.value != 'null'){
                    defaultValues[fieldName] = singleField.value;
                }
            }
            this.fieldsValues = defaultValues;
            // console.log('field', defaultValues);
            console.log('fieldsValues', this.fieldsValues);
            
            cont = this.fieldsValues;

            saveStudent({objStudent: cont})
            .then(result => {
                this.recordId = result;
                window.console.log('result ===> ' + result + 'reordid ---- ' + this.recordId);
             
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
            
            console.log("*** : " , this.allFieldSetList);
            // console.log("***field name : " , this.allFieldSetList,fieldName);
            console.log("*** : " , result.data);
        } 
        else if (result.error) {

            this.error = result.error;
            this.allFieldSetList = undefined;
            // const event  = new ShowToastEvent({
            //     title : 'Error',
            //     variant : 'error',
            //     message : result.error.body.message,
            // });
            // this.dispatchEvent(event);
        }
    }

    //Refresh the page and set input field to blank on refresh
    // refreshStudentComponent() {
    //     eval("$A.get('e.force:refreshView').fire();");
    // }

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
        console.log('Field_name'+field_name);
        if(field_name === 'fieldInput')
        {
            this.fieldInput = evt.target.value; 
            // this.studentRecord.FirstName = evt.target.value;     
        }
               
    }

    

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
        this.dispatchEvent(new CustomEvent('previous'));
    }

    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        } 
        this.dispatchEvent(new CustomEvent('next'));

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

    // handleRowAction(event) {
    //     if (event.detail.action.name === "view") {
    //         this[NavigationMixin.GenerateUrl]({
    //             type: "standard__recordPage",
    //             attributes: {
    //                 recordId: event.detail.row.Id,
    //                 actionName: "view"
    //             }
    //         }).then((url) => {
    //             window.open(url, "_blank");
    //         });
    //     }

    //     if (event.detail.action.name === "edit") {
    //         this[NavigationMixin.Navigate]({
    //             type: "standard__recordPage",
    //             attributes: {
    //                 recordId: event.detail.row.Id,
    //                 actionName: "edit"
    //             }
    //         });
    //     }
    // }
    
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        // const actionName = 'edit';
        console.log('action name: ' , actionName);
        const row = event.detail.row;
        console.log('row: ', row);

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




    editRecord(row) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'edit',
            },
        });
    }
    //currently we are doing client side delete, we can call apex tp delete server side
    deleteRecord(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    getSelectedName(event) {
        var selectedRows = event.detail.selectedRows;
        var recordIds=[];
        if(selectedRows.length > 0) {
            for(var i =0 ; i< selectedRows.length; i++) {
                recordIds.push(selectedRows[i].Id);
            }
            
           const selectedEvent = new CustomEvent('selected', { detail: {recordIds}, });
           // Dispatches the event.
           this.dispatchEvent(selectedEvent);
        }
        
    }

    // loadMoreData(event) {
    //     console.log('Load more JS made');
    //     //Display a spinner to signal that data is being loaded
    //     if(event.target){
    //         event.target.isLoading = true;
    //     }
    //     this.tableElement = event.target;
    //     //Display "Loading" when more data is being loaded
    //     this.loadMoreStatus = 'Loading';

    //     contactFieldSet( {ObjectName: 'Contact', recToReturn : 10} )
    //         .then((data) => {
    //             console.log('Load more Call made');  
    //                 //  contactRecord = this.contactRecord;
    //                 this.contactRecord = data;
    //                 //Appends new data to the end of the table
    //                 this.contactRecord  = this.contactRecord.concat(data); 
    //                 this.loadMoreStatus = '';
    //                 // this.totalRecords = this.contactRecord.length; 
    //                 if (this.contactRecord.length  >= this.maxRows) {
    //                     this.tableElement.enableInfiniteLoading = false;
    //                     this.loadMoreStatus = 'No more data to load';
    //                 }

    //             if(this.tableElement){
    //                 this.tableElement.isLoading = false;
    //             } 
    //         }
    //     );
    // }
}