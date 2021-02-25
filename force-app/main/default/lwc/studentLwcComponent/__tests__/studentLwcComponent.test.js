import { createElement } from 'lwc';
// import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import StudentLwcComponent from 'c/studentLwcComponent';

import { getNavigateCalledWith } from 'lightning/navigation';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
// import { ShowToastEventName } from 'lightning/platformShowToastEvent';

import saveStudent from '@salesforce/apex/studentDetailsController.saveStudent';
import retrieveObjectFields from '@salesforce/apex/studentDetailsController.retrieveObjectFields';

const SHOW_TOAST_EVT = 'lightning__showtoast';

// Mocked single contact record Id is only field required
// const mockGetSingleContact = require('./data/getSingleContact.json');

// Realistic data of fields of object
const mockGetObjectFieldtList = require('./data/getObjectFieldList.json');

// Register getSingleContact as Apex wire adapter. Tests require mocked Contact Id
const getContactFieldsAdapter = registerApexTestWireAdapter(retrieveObjectFields);

// Realistic data after a create record call
// const mockCreateRecord = require('./data/createRecord.json');

const APEX_CONTACTS_ERROR = 'undefined';

jest.mock(
  '@salesforce/apex/studentDetailsController.saveStudent',
  () => {
      return {
          default: jest.fn()
      };
  },
  { virtual: true }
);

// Sample data for imperative Apex call
const APEX_CONTACTS_SUCCESS = [
  {
      
      LastName: 'Amy Taylor',
      Phone: '4152568563',
      Email: 'amy@demo.net',
      Id: '0031700000pJRRSAA4'
     
  }
];

describe('c-student-Lwc-Component', () => {
    afterEach(() => {
      // The jsdom instance is shared across test cases in a single file so reset the DOM
      while(document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      jest.clearAllMocks();
    });


    describe('retrieve Contact Fields @wire', () => {
      it('renders object fields when data returned', () => {
          // Create initial element
          const element = createElement('c-student-Lwc-Component', {
              is: StudentLwcComponent
          });
          document.body.appendChild(element);

          // Emit data from @wire
          getContactFieldsAdapter.emit(mockGetObjectFieldtList);

          // Return a promise to wait for any asynchronous DOM updates. Jest
          // will automatically wait for the Promise chain to complete before
          // ending the test and fail the test if the promise rejects.
          return Promise.resolve().then(() => {
              // Select elements for validation
              const detailEls = element.shadowRoot.querySelectorAll('lightning-input-field');
              expect(detailEls.length).toBe(mockGetObjectFieldtList.length);
              expect(detailEls[0].fieldName).toBe(
                mockGetObjectFieldtList[0].fieldName
              );
          });
      });

      it('shows error panel element when error returned', () => {
        // Create initial element
        const element = createElement('c-student-Lwc-Component', {
            is: StudentLwcComponent
        });
        document.body.appendChild(element);

        // Emit error from @wire
        getContactFieldsAdapter.error();

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector(
                'lightning-input-field'
            );
            expect(errorPanelEl).toBeNull();
        });
    });
    });


  //   it('input contact form field values', () => {
  //     const LAST_NAME = 'test';

  //     // Create initial element
  //     const element = createElement('c-student-Lwc-Component', {
  //         is: StudentLwcComponent
  //     });
  //     document.body.appendChild(element);

  //     // Query lightning-input elements
  //     const lightningInputEls = element.shadowRoot.querySelectorAll(
  //         'lightning-input-field'
  //     );

     
  //     lightningInputEls.forEach((el) => {
  //       if (el.field-name === 'Last Name') {
  //           el.value = LAST_NAME;
  //       } 
  //       expect(el.length).toBe(LAST_NAME.length);
  //     });

  //     // Return a promise to wait for any asynchronous DOM updates. Jest
  //     // will automatically wait for the Promise chain to complete before
  //     // ending the test and fail the test if the promise rejects.
  //     return Promise.resolve().then(() => {
  //         // Compare if tracked property has been assigned a new value.
  //         const lightningInputEls = element.shadowRoot.querySelectorAll(
  //           'lightning-input-field'
  //       );
  //         lightningInputEls.forEach((el) => {
  //           if (el.field-name === 'Last Name') {
  //               el.value = LAST_NAME;
  //           } 
  //           expect(el.value).toBe(LAST_NAME.length);
  //           el.dispatchEvent(new CustomEvent('change'));
  //           expect(el).toBe(LAST_NAME);
  //           const buttonEl = element.shadowRoot.querySelector('lightning-button');
  //           buttonEl.click();
  //           expect(saveStudent).toHaveBeenCalled();
  //       });

       
  //     });
  // });

//   it('input contact form field reset values', () => {
//     const LAST_NAME = 'test';

//     // Create initial element
//     const element = createElement('c-student-Lwc-Component', {
//         is: StudentLwcComponent
//     });
    
//     document.body.appendChild(element);

//     // Query lightning-input elements
//     const lightningInputEls = element.shadowRoot.querySelectorAll(
//         'lightning-record-edit-form'
//     );
    
//       // Compare if tracked property has been assigned a new value.
//       const buttonEl = element.shadowRoot.querySelector(
//         'lightning-button'
//     );
//     // expect(buttonEl.title).toBe('Cancel');
//          buttonEl.title = 'Cancel';
//          buttonEl.label = 'Cancel';
//          expect(buttonEl.title).toBe('Cancel');
//     // if(buttonEl.title === 'Cancel'){
//     //   console.log('button title **'+buttonEl.title);
//     //   buttonEl.dispatchEvent(new CustomEvent('click'));
//     //   buttonEl.click();
//     // }
//     // else{
//     //   console.log('button title **'+buttonEl.title);
//     // }

//     // Return a promise to wait for any asynchronous DOM updates. Jest
//     // will automatically wait for the Promise chain to complete before
//     // ending the test and fail the test if the promise rejects.
//     return Promise.resolve().then(() => {
//         // Compare if tracked property has been assigned a new value.
//         if(buttonEl.title === 'Cancel'){
//           console.log('button title **'+buttonEl.title);
//           buttonEl.dispatchEvent(new CustomEvent('click'));
//           // buttonEl.click();
//         }

  
//     });
// });



 // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling createRecord.
    function flushPromises() {
      // eslint-disable-next-line no-undef
      return new Promise((resolve) => setImmediate(resolve));
  }


  it('sets value from lightning-input field as parameter to createRecord call', () => {
    const USER_INPUT = 'Taylor';
    const LAST_NAME ='Sam';
    // const INPUT_PARAMETERS = [
    //     { apiName: 'Account', fields: { Name: USER_INPUT } }
    // ];
   
    // Assign mock value for resolved Apex promise
    saveStudent.mockResolvedValue(APEX_CONTACTS_SUCCESS);
    // Create initial element
    const element = createElement('c-student-Lwc-Component', {
        is: StudentLwcComponent
    });
    document.body.appendChild(element);

const lightningInputEls = element.shadowRoot.querySelectorAll(
  'lightning-input-field'
);


lightningInputEls.forEach((el) => {
if (el.field-name === 'Last Name') {
    el.value = LAST_NAME;
} 
expect(el.value).toBe(LAST_NAME.length);
el.dispatchEvent(new CustomEvent('change'));
});


    // inputEl.forEach((el) => {
    //   if (el.field-name === 'Last Name') {
    //       el.value = USER_INPUT;
    //   } 
      // expect(el.value).toBe(LAST_NAME.length);
      // el.dispatchEvent(new CustomEvent('change'));
    // inputEl.value = USER_INPUT;
    // inputEl.dispatchEvent(new CustomEvent('change'));

    // Select button for simulating user interaction
    const buttonEl = element.shadowRoot.querySelector('lightning-button');
    buttonEl.click();

    return flushPromises().then(() => {
      // Select element for validation
      const displayEl = element.shadowRoot.querySelectorAll(
          'lightning-input-field'
      );


      displayEl.forEach((dl) => {
        if (dl.field-name === 'Last Name') {
          expect(dl.value).toBe(APEX_CONTACTS_SUCCESS.Id);
          
        } 
        expect(dl.value).toBe(LAST_NAME.length);
        // el.dispatchEvent(new CustomEvent('change'));
        });
        
      expect(displayEl.value).toBe(APEX_CONTACTS_SUCCESS.Id);
  });
});
  
it('renders the error panel when the Apex method returns an error', () => {
  // Assing mock value for rejected Apex promise
  saveStudent.mockRejectedValue(APEX_CONTACTS_ERROR);

  // Create initial element
  const element = createElement('c-student-Lwc-Component', {
      is: StudentLwcComponent
  });
  document.body.appendChild(element);

  // Select button for executing Apex call
  const buttonEl = element.shadowRoot.querySelector('lightning-button');
  buttonEl.click();

  // Return an immediate flushed promise (after the Apex call) to then
  // wait for any asynchronous DOM updates. Jest will automatically wait
  // for the Promise chain to complete before ending the test and fail
  // the test if the promise ends in the rejected state.
  return flushPromises().then(() => {
      const errorPanelEl = element.shadowRoot.querySelector(
         'lightning-input-field'
      );
      expect(errorPanelEl).toBeNull();
  });
});


    it('renders lightning-record-edit-form with given input values', () => {
      const RECORD_ID_INPUT = '0031y00000A4rXZAAZ';
      // const OBJECT_API_NAME_INPUT = 'Contact';

      // Create initial element
      const element = createElement('c-student-Lwc-Component', {
          is: StudentLwcComponent
      });
      // Set public properties
      element.recordId = RECORD_ID_INPUT;
      
      // element.objectApiName = OBJECT_API_NAME_INPUT;
      document.body.appendChild(element);

      // Validate if correct parameters have been passed to base components
      const formEl = element.shadowRoot.querySelector(
          'lightning-record-edit-form'
      );
      expect(formEl.recordId).toBe(RECORD_ID_INPUT);
      // expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);

      // Validate if submit button is defined
      const buttonEl = element.shadowRoot.querySelector('lightning-button');
      expect(buttonEl.label).toBe('Submit');
      expect(buttonEl.title).toBe('Submit');
      buttonEl.label = 'Cancel';
      buttonEl.title = 'Cancel';
      expect(buttonEl.title).toBe('Cancel');
      buttonEl.dispatchEvent(new CustomEvent("click"));
  });

  it('renders lightning-record-edit-form check invalid record id', () => {
    const RECORD_ID_INPUT = '0031y00000A4rXZAAV';
    const ERROR_MESSAGE = "undefined";
    // const OBJECT_API_NAME_INPUT = 'Contact';

    // Create initial element
    const element = createElement('c-student-Lwc-Component', {
        is: StudentLwcComponent
    });
    // Set public properties
    element.recordId = RECORD_ID_INPUT;
    element.error = ERROR_MESSAGE;
    // element.objectApiName = OBJECT_API_NAME_INPUT;
    document.body.appendChild(element);

    // Validate if correct parameters have been passed to base components
    const formEl = element.shadowRoot.querySelector(
        'lightning-record-edit-form'
    );
    expect(formEl.recordId).toBe(RECORD_ID_INPUT);
    expect(formEl.error).toBe(undefined);
    // expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);

    // Validate if submit button is defined
    const buttonEl = element.shadowRoot.querySelector('lightning-button');
    expect(buttonEl.label).toBe('Submit');
    expect(buttonEl.title).toBe('Submit');
});

  it('displays last name', () => {

    const LAST_NAME = 'Peter';
    const ALLFIELDSET =  [{fieldLabel: "First Name", fieldName: "FirstName", isHtmlFormatted: false, isRequired: false, key: 1},
     {fieldLabel: "Last Name", fieldName: "LastName", isHtmlFormatted: false, isRequired: true, key: 2},
     {fieldLabel: "Email", fieldName: "Email", isHtmlFormatted: false, isRequired: false, key: 3},
    {fieldLabel: "Business Phone", fieldName: "Phone", isHtmlFormatted: false, isRequired: false, key: 4},
     {fieldLabel: "Birthdate", fieldName: "Birthdate", isHtmlFormatted: false, isRequired: false, key: 5},
     {fieldLabel: "Account ID", fieldName: "AccountId", isHtmlFormatted: false, isRequired: false, key: 6},
     {fieldLabel: "Contact ID", fieldName: "Id", isHtmlFormatted: false, isRequired: true, key: 7}
    ]
    // Create initial element
    const element = createElement('c-student-Lwc-Component', {
        is: StudentLwcComponent
    });
    
    element.fieldInput = LAST_NAME;
    element.inputFields = 'Last Name';
    element.allFieldSetList = ALLFIELDSET;
    document.body.appendChild(element);

    // setInputElementValues(element, 'Peter');

    // Validate if correct parameters have been passed to base components
    const formEl = element.shadowRoot.querySelector(
      'lightning-input-field'
  );
  if(formEl.field-name === 'Last Name')
  {
  expect(formEl.value).toBe(LAST_NAME);
  }

    element.shadowRoot.querySelectorAll('lightning-input-field').forEach((input) => {
      if (input.field-name === 'Last Name') {
        
        console.log('input.field-name ' + input.field-name );
          input.value = 'Peter';
          input.dispatchEvent(new CustomEvent('change'));
      }
    });
    const detailEl = element.shadowRoot.querySelector('lightning-input-field');
    // detailEl.value = [{LastName: "Peter"}];
    expect(detailEl.value).toEqual('Peter');
    detailEl.dispatchEvent(new CustomEvent('change'));
    expect(detailEl.value).toEqual('Peter');

    const buttonEl = element.shadowRoot.querySelector(
      'lightning-button'
  );

 
  // expect(buttonEl.title).toBe('Cancel');
      //  buttonEl.value = 'Cancel';
      //  buttonEl.label = 'Cancel';
      //  buttonEl.title = 'Cancel';
       if(buttonEl.value === 'Cancel'){
         console.log('******' + buttonEl.value);
        const buttonCancel = element.shadowRoot.querySelector('lightning-button');
        buttonCancel.dispatchEvent(new CustomEvent('click'));
      }
      //  const buttonCancel = element.shadowRoot.querySelector('lightning-button');
      //  console.log('buttoncancel' + buttonEl.value);
      //  console.log('buttoncancel' + buttonCancel.value);
      //  expect(buttonEl.value).toBe('Cancel');
      //  buttonEl.dispatchEvent(new CustomEvent('click'));
      //  expect(buttonEl.value).toEqual('Cancel');
       expect(buttonEl.title).toBe('Cancel');
    // expect(detailEl.value).toBe('Peter');
    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    // return Promise.resolve().then(() => {
    //     // Verify displayed message
    //      const detailEl = element.shadowRoot.querySelector('lightning-input-field');
    //     // detailEl.value = [{LastName: "Peter"}];
    //     expect(detailEl.textContent).toEqual('Peter');
    // });
});






  it('navigates to record view', () => {
    // Nav param values to test later
    const LAST_NAME = 'Sam';
    const NAV_TYPE = 'standard__recordPage';
    const NAV_OBJECT_API_NAME = 'Contact';
    const NAV_ACTION_NAME = 'view';
    const NAV_RECORD_ID = '0031700000pJRRSAA4';
    const RECORD_ID_INPUT = '0031y00000A3ztpAAB';
    const ALLFIELDSET =  [{fieldLabel: "First Name", fieldName: "FirstName", isHtmlFormatted: false, isRequired: false, key: 1},
     {fieldLabel: "Last Name", fieldName: "LastName", isHtmlFormatted: false, isRequired: true, key: 2},
     {fieldLabel: "Email", fieldName: "Email", isHtmlFormatted: false, isRequired: false, key: 3},
    {fieldLabel: "Business Phone", fieldName: "Phone", isHtmlFormatted: false, isRequired: false, key: 4},
     {fieldLabel: "Birthdate", fieldName: "Birthdate", isHtmlFormatted: false, isRequired: false, key: 5},
     {fieldLabel: "Account ID", fieldName: "AccountId", isHtmlFormatted: false, isRequired: false, key: 6},
     {fieldLabel: "Contact ID", fieldName: "Id", isHtmlFormatted: false, isRequired: true, key: 7}
    ]
    const FIELDINPUT = {AccountId: "0011y00000CP8q2AAD", Birthdate: "2021-02-10", Email: "t@gmail.com", FirstName: "test", LastName: "test", Phone: "12", Id:"undefined"};
    
    // Create initial lwc element and attach to virtual DOM
    const element = createElement('c-student-Lwc-Component', {
        is: StudentLwcComponent
    });
    // element.recordId = RECORD_ID_INPUT;
    element.allFieldSetList = ALLFIELDSET;
    element.fieldInput = FIELDINPUT;
    element.fields = FIELDINPUT;
    document.body.appendChild(element);

    // Query lightning-input elements
    const lightningInputEls = element.shadowRoot.querySelectorAll(
      'lightning-input-field'
  );
    // Simulate the data sent over wire adapter to hydrate the wired property
    // element.recordId.emit(RECORD_ID_INPUT);

    // Return a promise to wait for any asynchronous DOM updates. Jest
    // will automatically wait for the Promise chain to complete before
    // ending the test and fail the test if the promise rejects.
    return Promise.resolve().then(() => {
      
        // Get handle to view button and fire click event
        const buttonEl = element.shadowRoot.querySelector(
            'lightning-button'
        );
        buttonEl.click();
        buttonEl.recordId = RECORD_ID_INPUT;
        const { pageReference } = getNavigateCalledWith();

        // Verify component called with correct event type and params
        expect(pageReference.type).toBe(NAV_TYPE);
        expect(pageReference.attributes.objectApiName).toBe(
            NAV_OBJECT_API_NAME
        );
        expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
        expect(pageReference.attributes.recordId).toBe(APEX_CONTACTS_SUCCESS);
    });
  });


   
  it('the ShowToastEvent is fired when the user clicks the button', () => {
    const USER_INPUT = 'Amy Taylor';
    saveStudent.mockResolvedValue(APEX_CONTACTS_SUCCESS);
    const ToastExampleElement = createElement('c-student-Lwc-Component', {
      is: StudentLwcComponent
  });
  document.body.appendChild(ToastExampleElement);

  const showToastHandler = jest.fn();
  // ToastExampleElement.addEventListener(ShowToastEventName, showToastHandler);
  ToastExampleElement.addEventListener(SHOW_TOAST_EVT, showToastHandler);

  const lightningInputEls = ToastExampleElement.shadowRoot.querySelectorAll(
    'lightning-input-field'
  );
  
  
  lightningInputEls.forEach((el) => {
  if (el.field-name === 'Last Name') {
      el.value = USER_INPUT;
  } 
  expect(el.value).toBe(USER_INPUT.length);
  el.dispatchEvent(new CustomEvent('change'));
  });
  //  // Select button for simulating user interaction
  //  const buttonEl = element.shadowRoot.querySelector('lightning-button');
  //  buttonEl.click();

  return Promise.resolve().then(() => {
      const showToastBtn = ToastExampleElement.shadowRoot.querySelector('lightning-button');
      showToastBtn.click();

  }).then(()=> {
      expect(showToastHandler).toBeCalledTimes(1);
      // Check if toast event has been fired
      expect(showToastHandler).toHaveBeenCalled();
      
  });

  });



//   it('renders given set of lightning-output-field`s in specific order', () => {
//     const INPUT_FIELDS = [{ fieldName: "FirstName"}, {fieldName: "LastName"},
//     {fieldName: "Email"},{fieldName: "Phone"},{fieldName: "Birthdate"},{fieldName: "AccountId"},{fieldName: "Id"}];
  
//     const RECORD_ID_INPUT = '0031y00000A4rXZAAZ';
//     // const OBJECT_API_NAME_INPUT = 'Contact';

//     // Create initial element
//     const element = createElement('c-student-Lwc-Component', {
//         is: StudentLwcComponent
//     });
//     // Set public properties
//     element.recordId = RECORD_ID_INPUT;
//     // element.objectApiName = OBJECT_API_NAME_INPUT;
//     document.body.appendChild(element);

//     // Select elements for validation
//     const outputFieldNames = Array.from(
//         element.shadowRoot.querySelectorAll('lightning-input-field')
//     ).map((outputField) => outputField.fieldName);
//     expect(outputFieldNames).toEqual(INPUT_FIELDS);
// });

// it('is accessible', () => {
//     const element = createElement('c-student-Lwc-Component', {
//         is: StudentLwcComponent
//     });

//     document.body.appendChild(element);

//     return Promise.resolve().then(() => expect(element).toBeAccessible());
// });
   






});