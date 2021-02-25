public with sharing class studentDetailsController {

    @AuraEnabled
    public static String saveStudent(Contact objStudent){
        try{
            
            system.debug('contact'+ objStudent);
            upsert objStudent;
           return objStudent.Id;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }


 //Retrive object fields
    @AuraEnabled(cacheable=true)
    public static List<FieldWrapper> retrieveObjectFields(String fieldSetName, String ObjectName, String ParentObject) {
        return getFieldSetMember(fieldSetName, ObjectName, ParentObject);
    }
    
    //get all fields set name using by ojbect name and field set name
    private static List<FieldWrapper> getFieldSetMember(String fieldSetName, String ObjectName, String ParentObject) {
        List<FieldWrapper> lstfieldWrapper = new List<FieldWrapper>();
        if (String.isNotBlank(fieldSetName) && String.isNotBlank(ObjectName)) {
          
            Schema.DescribeSObjectResult describeSObjectResult = Schema.getGlobalDescribe().get(ObjectName).getDescribe();
            Map<String,Schema.SObjectField> objFieldMap = describeSObjectResult.fields.getMap();
            System.debug('objFieldMap****: ' + objFieldMap);
            Schema.FieldSet fieldSetObj = describeSObjectResult.FieldSets.getMap().get(fieldSetName);
            
            // System.debug((String)describeSObjectResult.getSobject('Account').get('Name'));
        
            // List<sObject> contactObj = studentDetailsController.getContactList('Contact');

        

            // System.debug('contactObj: ' + contactObj);
            // string Accname = string.valueof(contactObj.getSobject('Contact').getSobject('Account').get('Name'));
// String  Channel = (String)ObjectName.getSObject('Account').get('Name');
//  System.debug('Channel: '+ Channel);

//  for(SObject s : contactObj){
//     Contact fobjContact = (Contact)s;
//     System.debug('fobjContact:' + fobjContact);
//     Account fobjAccount = fobjContact.Account;
//     System.debug('fobjAccount:' + fobjAccount);
//     System.debug('fobjAccount.Name:' + fobjAccount.Name);
// }


            // System.debug('Account name: ' + Accname);


            // System.debug('fieldSetObj.getFields()****: ' + fieldSetObj.getFields());
          

              Schema.DescribeSObjectResult describeSObjectResultP = Schema.getGlobalDescribe().get(ParentObject).getDescribe();
            Map<String,Schema.SObjectField> objFieldMapP = describeSObjectResultP.fields.getMap();
            System.debug('objFieldMapP****: ' + objFieldMapP);
           
                

                List<Actions> actionList = new List<Actions>();
                // actionList.add(new Actions('Edit','edit'));
                actionList.add(new Actions('View','view'));
                // actionList.add(new Actions('Delete','delete'));
                TypeAttributes tAttribute = new TypeAttributes(actionList);


                // List<Account> acc  = new List<Account>();
                // acc.add(new Account('Id', 'AccountId'));
                // acc.add(new Account('AccountName', 'AccountName'));
                
               
                // Accounts ac = new Accounts(acc);
                
                // labelList.add(new LabelDescriptionWrapper('', '', 'action', false, false, tAttribute ));


for(Schema.FieldSetMember fieldSet : fieldSetObj.getFields() ) {

    System.debug('***fieldset: '+ (fieldSet.getDBRequired() || fieldSet.getRequired()));
    System.debug('***fieldset: '+ String.ValueOf(fieldSet.getType()));
    System.debug('**objFieldMapP**' + objFieldMap.get(String.ValueOf(fieldSet.getFieldPath()))) ;
    // System.debug(String.ValueOf(fieldSet.getFieldPath()).getDescribe().isHtmlFormatted());
    // System.debug(String.ValueOf(fieldSet.getFieldPath()).getDescribe().isCalculated());
    System.debug(fieldSet.getType());
    
}

            if (fieldSetObj != null) {
                Integer counter = 0;
            
                for(Schema.FieldSetMember fieldSet : fieldSetObj.getFields() ) {
                    
                    lstfieldWrapper.add( new FieldWrapper(
                        String.ValueOf(fieldSet.getLabel()),
                        String.ValueOf(fieldSet.getFieldPath()),
                        (fieldSet.getDBRequired() || fieldSet.getRequired()),
                        // objFieldMap.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().getInlineHelpText(),
                        // objFieldMap.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().isHtmlFormatted() &&
                        // objFieldMap.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().isCalculated() , 
                        ++counter,
                        String.ValueOf(fieldSet.getType()),
                        tAttribute
                        
                    )); 
                    System.debug('Type: ' + String.ValueOf(fieldSet.getType()));

                }

                // for(Schema.FieldSetMember fieldSet : fieldSetObj.getFields() ) {
                    
                //         lstfieldWrapper.add( new FieldWrapper(
                //         String.ValueOf(fieldSet.getLabel()),
                //         String.ValueOf(fieldSet.getFieldPath()),
                //         (fieldSet.getDBRequired() || fieldSet.getRequired()),
                //         objFieldMapP.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().getInlineHelpText(),
                //         objFieldMapP.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().isHtmlFormatted() &&
                //         objFieldMapP.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().isCalculated() , 
                //         ++counter,
                //         String.ValueOf(fieldSet.getType()),
                //         tAttribute
                        
                        
                //     ));
                //     System.debug('***String.ValueOf(fieldSet.getFieldPath())).getDescribe().getInlineHelpText():  ' + objFieldMapP.get(String.ValueOf(fieldSet.getFieldPath())).getDescribe().getInlineHelpText());
                // }

                // lstfieldWrapper.add(new FieldWrapper('Account Name', 'Account.Name',true,'Account Name',false,8,'STRING',tAttribute, ac));
                lstfieldWrapper.add(new FieldWrapper('action', 'Actions',false,9,'action',tAttribute));
            
            }
        }
        System.debug('lstfieldWrapper: '+lstfieldWrapper);
        return lstfieldWrapper; 
    }




    
    // Wrpper class for field set
    public class FieldWrapper {
        @AuraEnabled public String fieldName {get;set;}
        @AuraEnabled public String label {get;set;}
        @AuraEnabled public Boolean isRequired {get;set;}
        // @AuraEnabled public String helpText {get;set;}
        // @AuraEnabled public Boolean isHtmlFormatted {get;set;}
        @AuraEnabled public Integer key {get;set;}
        @AuraEnabled public String type {get;set;}
        @AuraEnabled public TypeAttributes typeAttributes {get;set;}
        // @AuraEnabled public Accounts accounts {get;set;}
        
        
        public FieldWrapper(String label,String fieldName,Boolean isRequired, Integer key, String fieldType, TypeAttributes typeAttributesTemp ) {
            this.label  = label;
            this.fieldName   = fieldName;
            this.isRequired  = isRequired;
            // this.helpText    = helpText;
            // this.isHtmlFormatted = isHtmlFormatted;
            this.key = key;
            this.type = fieldType;
            this.typeAttributes = typeAttributesTemp;
            // this.accounts = accounts;
        }
    }

    //Wrapper class to bind dropdown action with data row
    public class TypeAttributes  {
        @AuraEnabled
        public List<Actions> rowActions ;
        
        public TypeAttributes(List<Actions> rowActionsTemp) {
            rowActions 	  = rowActionsTemp;
        }
    }

    //Wrapper class  to store dropdown action
    public class Actions {
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String fieldName;

        //  @AuraEnabled public String fieldName {get;set;}
        // @AuraEnabled public String label {get;set;}
        
        public Actions(String labelTemp, String nameTemp) {
            this.label	  	= labelTemp;
            this.fieldName	= nameTemp;
        }
    }  


//  //Wrapper class to bind dropdown action with data row
//     public class Accounts  {
//         @AuraEnabled
//         public List<Account> acc ;
        
//         public Accounts(List<Account> acc) {
//             this.acc 	  = acc;
//         }
//     }

//     //Wrapper class  to store dropdown action
//     public class Account {
//         @AuraEnabled
//         public String label;
//         @AuraEnabled
//         public String name;

//         //  @AuraEnabled public String fieldName {get;set;}
//         // @AuraEnabled public String label {get;set;}
        
//         public Account(String labelTemp, String nameTemp) {
//             this.label	  	= labelTemp;
//             this.name	= nameTemp;
//         }
//     }  


// public class DataTableResponse {
//         @AuraEnabled
//         public List<FieldWrapper> lstDataTableColumns {get;set;}
//         @AuraEnabled
//         public List<sObject> lstDataTableData {get;set;}     

//         public DataTableResponse(){
//             lstDataTableColumns = new List<FieldWrapper>();
//             lstDataTableData = new List<sObject>();
//         }
//     }

    public static List<Schema.FieldSetMember> getFields() {

       
        // Schema.SObjectType s = Schema.getGlobalDescribe().get(ObjectName) ;

        // Schema.DescribeSObjectResult r = s.getDescribe() ;

        // Schema.DescribeSObjectResult describeSObjectResult = Schema.getGlobalDescribe().get(ObjectName).getDescribe();
        // String ObjectNamee = ObjectName.getSObjectType().getDescribe().getName();
        return SObjectType.Contact.FieldSets.StudentDetails.getFields();
        // return s.FieldSets.StudentDetails.getFields();
    }

    // @AuraEnabled(cacheable=true)
    // public static List<Contact> getContactList(id contactId) {
    //     System.debug(contactId);

    //     String query = 'SELECT ';
    //     for(Schema.FieldSetMember f : studentDetailsController.getFields()) {
    //         query += f.getFieldPath() + ', ';
    //     }
    //     query += 'Id FROM Contact WHERE ID=\''+contactId+'\'';
    //     sObject contactObj = Database.query(query);
      
    // //     System.debug('Database.query*** : ' + Database.query(query) );

    //     for(Schema.FieldSetMember f : studentDetailsController.getFields()){
    //         contactObj.get(f.getFieldPath());
    //         System.debug('Conatct object: ' + contactObj);
    //     }
    //     String result = '';
        
    //     for(Schema.FieldSetMember f : studentDetailsController.getFields()) {
            
    //     //     // if(String.valueOf(f.getType()) == 'DATE')
    //     //     // {
    //     //     //     System.debug('****Inside date');


    //     //     // }
    //     //     // else{
    //         result += String.valueOf(contactObj.get(f.getFieldPath())) + '\r\n';
    //         System.debug('contact********' + f.getType());
    //     //     // }
    //     }
       
    //     // System.debug('Result***' + result);
    //     // System.debug(query);
    //     // System.debug(Database.query(query));
    //     return Database.query(query);
    //     // return result;
    // }

    
    //      @AuraEnabled
    //     public static String doUpsertObjects(Contact objStudent){
    //     upsert objStudent;
    //     String insert = 'INSERT';

    //     return JSON.serialize(objStudent);
    // }



 @AuraEnabled(cacheable=true)
    public static List<sObject> getContactList(String ObjectName) {
        // System.debug(contactId);
     Schema.DescribeSObjectResult describeSObjectResult = Schema.getGlobalDescribe().get('Contact').getDescribe();
            // Map<String,Schema.SObjectField> objFieldMap = describeSObjectResult.fields.getMap();
           
            Schema.FieldSet fieldSetObj = describeSObjectResult.FieldSets.getMap().get('StudentDetails');


        String query = 'SELECT ';
        for(Schema.FieldSetMember f : fieldSetObj.getFields()) {
            if(f.getFieldPath() != 'Id')
            {
            query += f.getFieldPath() + ', ';
            System.debug('studentDetailsController.getFields(): ' + studentDetailsController.getFields());
            System.debug('f.getFieldPath(): '  + f.getFieldPath());
            }
        }
        query += ' Id FROM ';
        query += ObjectName + ' LIMIT 10';
        System.debug('queryyyyyyyy: ' + query);
        // sObject contactObj = Database.query(query);
      
    //     System.debug('Database.query*** : ' + Database.query(query) );

        // for(Schema.FieldSetMember f : studentDetailsController.getFields()){
        //     contactObj.get(f.getFieldPath());
        //     System.debug('Conatct object: ' + contactObj);
        // }
        // String result = '';
        
        // for(Schema.FieldSetMember f : studentDetailsController.getFields()) {
            
        //     // if(String.valueOf(f.getType()) == 'DATE')
        //     // {
        //     //     System.debug('****Inside date');


        //     // }
        //     // else{
            // result += String.valueOf(contactObj.get(f.getFieldPath())) + '\r\n';
            // System.debug('contact********' + f.getType());
        //     // }
        // }
       
        // System.debug('Result***' + result);
        // System.debug(query);
        // System.debug(Database.query(query));
        return Database.query(query);
        // return query;
    }


 @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(List<String> selectedFields){
        String s = '';
        Integer i = 0;

        for(String field : selectedFields){
            if(i == 0){
                s+= field;
            }else{
                s+= ','+field;
            }
            i++;

        }
        String query = 'SELECT ' + s + ' FROM Contact';
        System.debug('getContacts(): ' + query);
        
        return Database.query(query);
    }






}