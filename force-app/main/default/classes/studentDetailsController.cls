public with sharing class studentDetailsController {

    @AuraEnabled
    public static String saveStudent(Contact objStudent){
        try{ 
           upsert objStudent;
           return objStudent.Id;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }


 //Retrive object fields
    @AuraEnabled(cacheable=true)
    public static List<FieldWrapper> retrieveObjectFields(String fieldSetName, String ObjectName) {
        return getFieldSetMember(fieldSetName, ObjectName);
    }
    
    //get all fields set name using by ojbect name and field set name
    private static List<FieldWrapper> getFieldSetMember(String fieldSetName, String ObjectName) {
        List<FieldWrapper> lstfieldWrapper = new List<FieldWrapper>();
        if (String.isNotBlank(fieldSetName) && String.isNotBlank(ObjectName)) {
          
            Schema.DescribeSObjectResult describeSObjectResult = Schema.getGlobalDescribe().get(ObjectName).getDescribe();
            Map<String,Schema.SObjectField> objFieldMap = describeSObjectResult.fields.getMap();
            Schema.FieldSet fieldSetObj = describeSObjectResult.FieldSets.getMap().get(fieldSetName);
            
            List<Actions> actionList = new List<Actions>();
            actionList.add(new Actions('View','view'));
            TypeAttributes tAttribute = new TypeAttributes(actionList);

            if (fieldSetObj != null) {
                Integer counter = 0;
                String url = 'url';
                String target = '_blank';
                String AccountName =  'AccountName';
            
                for(Schema.FieldSetMember fieldSet : fieldSetObj.getFields() ) {
                    
                     if (fieldSet.getFieldPath() == 'LastName') {

                        lstfieldWrapper.add( new FieldWrapper(
                        String.ValueOf(fieldSet.getLabel()),
                        String.ValueOf(fieldSet.getFieldPath()),
                        (fieldSet.getDBRequired() || fieldSet.getRequired()),
                        ++counter,
                        url,
                        tAttribute,
                        target
                        
                    )); 
                        
                    }

                    else if(fieldSet.getFieldPath() == 'Account.Name'){
                        
                        lstfieldWrapper.add( new FieldWrapper(
                        String.ValueOf(fieldSet.getLabel()),
                        AccountName,
                        (fieldSet.getDBRequired() || fieldSet.getRequired()),
                        ++counter,
                        url,
                        tAttribute,
                        target
                        
                    )); 
                   
                    }
                    else {
                        lstfieldWrapper.add( new FieldWrapper(
                        String.ValueOf(fieldSet.getLabel()),
                        String.ValueOf(fieldSet.getFieldPath()),
                        (fieldSet.getDBRequired() || fieldSet.getRequired()),
                        ++counter,
                        String.ValueOf(fieldSet.getType()),
                        tAttribute,
                        target
                        
                    )); 
                    }
                }
      
                lstfieldWrapper.add(new FieldWrapper('action', 'Actions',false,++counter,'action',tAttribute, target));
            
            }
        }
        
        return lstfieldWrapper; 
    }

    
    // Wrpper class for field set
    public class FieldWrapper {
        @AuraEnabled public String fieldName {get;set;}
        @AuraEnabled public String label {get;set;}
        @AuraEnabled public Boolean isRequired {get;set;}
        @AuraEnabled public Integer key {get;set;}
        @AuraEnabled public String type {get;set;}
        @AuraEnabled public TypeAttributes typeAttributes {get;set;}
         @AuraEnabled public String target {get;set;}
        
        public FieldWrapper(String label,String fieldName,Boolean isRequired, Integer key, String fieldType, TypeAttributes typeAttributesTemp, String target ) {
            this.label  = label;
            this.fieldName   = fieldName;
            this.isRequired  = isRequired;
            this.key = key;
            this.type = fieldType;
            this.typeAttributes = typeAttributesTemp;
            this.target = target;
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

        public Actions(String labelTemp, String nameTemp) {
            this.label	  	= labelTemp;
            this.fieldName	= nameTemp;
        }
    }  


    public static List<Schema.FieldSetMember> getFields() {

        return SObjectType.Contact.FieldSets.StudentDetails.getFields();
        
    }

 @AuraEnabled(cacheable=true)
    public static List<sObject> getContactList(String fieldSetName, String ObjectName) {
      
     Schema.DescribeSObjectResult describeSObjectResult = Schema.getGlobalDescribe().get(ObjectName).getDescribe();
     Schema.FieldSet fieldSetObj = describeSObjectResult.FieldSets.getMap().get(fieldSetName);

    String query = 'SELECT ';
        for(Schema.FieldSetMember f : fieldSetObj.getFields()) {
            if(f.getFieldPath() != 'Id')
            {
            query += f.getFieldPath() + ', ';
            }
        }
        query += ' Id FROM ';
        query += ObjectName + ' LIMIT 20';
       
        return Database.query(query);
    }
}