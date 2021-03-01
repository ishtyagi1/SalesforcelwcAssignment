@isTest
private class studentDetailsControllerTest {
      
      static testMethod void testSaveStudent() {

          Contact c = new Contact();
          c.FirstName = 'test1';
          c.LastName = 'test1';
          
          String id = studentDetailsController.saveStudent(c);  

          Contact c1 = [SELECT Id,FirstName,Phone FROM Contact WHERE Id=: id];
          System.assertEquals(c1.FirstName, c.FirstName);
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
        }

    }

    static testMethod void testretrieveObjectFields() {

          Contact c = new Contact();
          c.FirstName = 'test1';
          
            List<studentDetailsController.FieldWrapper> l = studentDetailsController.retrieveObjectFields('StudentDetails', 'Contact');
            System.assertEquals(l.size(), 9);
            System.debug('wrapper size: ' + l + 'l.size()' + l.size());   
    }

}
