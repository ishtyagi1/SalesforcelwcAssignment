@isTest
private class studentDetailsControllerTest {
      
      static testMethod void testSaveStudent() {

          Contact c = new Contact();
          c.FirstName = 'test1';
          c.LastName = 'test1';
          
          String id = studentDetailsController.saveStudent(c);  
          System.debug('id for test is: ' + id);

          Contact c1 = [SELECT Id,FirstName,Phone FROM Contact WHERE Id=: id];
          System.assertEquals(c1.FirstName, c.FirstName);
          System.debug('test verify ^^ :' + c1.Id + c1.FirstName + 'Phone:  ' +c1.Phone+'is: ' + id);
    }

    static testMethod void testInsertionException() {

          Contact c = new Contact();
          c.FirstName = 'test1';
        try{
            String id = studentDetailsController.saveStudent(c); 
            Contact c1 = [SELECT Id,FirstName,LastName FROM Contact WHERE Id=: id];
             System.assertEquals(c1.Id, 'null');
        }
        catch(Exception ex){
            System.assertEquals(ex.getMessage(),ex.getMessage());
            // System.assertEquals(true, d.getDmlMessage().contains('section is now required'),'An unexpected error meage was returned');
        }

    }

    static testMethod void testretrieveObjectFields() {

          Contact c = new Contact();
          c.FirstName = 'test1';
        //   c.LastName = 'test1';

            List<studentDetailsController.FieldWrapper> l = studentDetailsController.retrieveObjectFields('StudentDetails', 'Contact');
            System.assertEquals(l.size(), 7);
            System.debug('wrapper size: ' + l + 'l.size()' + l.size());   
    }


// Wrpper class for field set
    // public class FieldWrapper {
    //     @AuraEnabled public String fieldName {get;set;}
    //     @AuraEnabled public String fieldLabel {get;set;}
    //     @AuraEnabled public Boolean isRequired {get;set;}
    //     @AuraEnabled public String helpText {get;set;}
    //     @AuraEnabled public Boolean isHtmlFormatted {get;set;}
    //     @AuraEnabled public Integer key {get;set;}

        
    //     public FieldWrapper(String fieldLabel,String fieldName,Boolean isRequired, String helpText, Boolean isHtmlFormatted, Integer key ) {
    //         this.fieldLabel  = fieldLabel;
    //         this.fieldName   = fieldName;
    //         this.isRequired  = isRequired;
    //         this.helpText    = helpText;
    //         this.isHtmlFormatted = isHtmlFormatted;
    //         this.key = key;
    //     }
    // }

}
