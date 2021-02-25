trigger CountTotalContactsInAccount on Contact (after INSERT, after UPDATE, after DELETE) {

Set <Id> accountIds = new Set <Id>();
List <Account> lstAccountsToUpdate = new List <Account>();
 if(Trigger.isInsert || Trigger.isUpdate){
    for(Contact con:trigger.new){
        accountIds.add(con.accountId);
        System.debug('After:  ' +  accountIds);
       

    }
}
if(Trigger.isDelete){
    for(Contact con:trigger.old){
        accountIds.add(con.accountId);
        System.debug('Deletion:  ' + accountIds);
    }
}

for(Account acc:[SELECT Id,Name,TotalContacts__c,(Select Id from Contacts) from Account where Id IN: accountIds]){
    Account accObj = new Account ();
    accObj.Id = acc.Id;
    accObj.TotalContacts__c = acc.Contacts.size();
    System.debug('*' + accObj);
    lstAccountsToUpdate.add(accObj);
    System.debug('**' + lstAccountsToUpdate);
}

UPDATE lstAccountsToUpdate;
}