class Warehouse {
    constructor(obj) {
        this.obj = obj; //give instance of class access to user inputted obj data
        this.requiredKeys = [ //initialize array to reference all required keys when creating a warehouse
            'warehouse_name',
            'address',
            'city',
            'country',
            'contact_name',
            'contact_position',
            'contact_phone',
            'contact_email'
        ];
    }

    //check phone number formatting function (returns null if it doesn't match)
    validPhoneNo(phoneNo) {
        if(typeof phoneNo === 'number') { //'defensive'
            phoneNo = phoneNo.toString();
        }
        //use regex to ensure phone number is flexible on formatting
        return phoneNo.match(/^\+?\d*\s?\(?\d{3}\)?\s?\d{3}[\s-]?\d{4}$/);
    }

    //check email formatting function (returns null if it doesn't match)
    validEmail(email) {
        //use regex to ensure proper email formatting is used by user
        return email.match(/^[\w.-]+@[\w.-]+\.\w+$/);
    }

    //check to see if any values are empty
    checkEmptyValues() {
        //filter through object and create an array of 'emptyValues' if any values are empty
        const emptyValues = Object.entries(this.obj).filter(
            value => value[1] === null ||
            value[1] === undefined || 
            (typeof value[1] === 'string' && value[1].trim() === "")
        );
        //if any values are missing, return object displaying input not valid, with all missing values
        if(emptyValues.length) {
            return {
                errorMessage: `Values missing from requested warehouse: '${emptyValues.map(e => `{ ${e[0]}: '${e[1]}' }`)}`
            };
        }
        return {
            success: true
        }
    }

    //check to see if any keys are 'unknown'
    filterUnknownKeys() {
        // create an empty filtered object to be populated with only the keys needed
        const filtered = {};
        //create an array to show user which keys are not being used
        let unknownKeys = [];
        //iterate through keys of user requested object
        Object.keys(this.obj).forEach((key) => {
            //if key is within requiredKeys, add it to 'filtered' object
            if (this.requiredKeys.includes(key)) {
                filtered[key] = this.obj[key];
            } else {
                //otherwise, omit that key and push to array
                unknownKeys.push(key);
            }
        });
        this.obj = filtered;
        if(unknownKeys.length){
            console.warn(`Keys ommitted from warehouse: '${unknownKeys}'`)
        }
    }

    validateWarehouse(crudType) {
        //ensure no unknown keys by filtering 'this.obj'
        this.filterUnknownKeys();
        //check what type of validation is required based on paramter
        if(crudType === 'create') { //create NEW warehouse

            //instantiated array that gives all keys requested by user
            const requestedKeys = Object.keys(this.obj);
            
            //filter through all required keys. Assign any missing to an array, to be returned as an error message
            const missingKeys = this.requiredKeys.filter(key => !requestedKeys.includes(key));
            //if any keys are missing, return object displaying input not valid, with all missing keys
            if(missingKeys.length) {
                return {
                    errorMessage: `Keys missing from requested warehouse: ${missingKeys.map(e => ` '${e}'`)}`
                };
            }
            // check if any values are empty using 'checkEmptyValues' class method
            const hasEmptyValues = this.checkEmptyValues();
            //if object returned includes 'errorMessage' key, return it
            if(hasEmptyValues.errorMessage) {
                return {
                    errorMessage: hasEmptyValues.errorMessage
                };
            }
            //if 'contact_phone' doesn't match desired format, return an error
            if(!this.validPhoneNo(this.obj.contact_phone)){
                return {
                    errorMessage: `ERROR  '${this.obj.contact_phone}' is not a valid phone number format.`
                }
            }
            //if 'contact_email' doesn't match desired format, return an error
            if(!this.validEmail(this.obj.contact_email)){
                return {
                    errorMessage: `ERROR  '${this.obj.contact_email}' is not a valid email format.`
                }
            }
            //passed all validation, return true
            return { 
                success: true
            };
        }
        else if(crudType === 'update') { //update EXISTING warehouse
            console.log(this.obj)
            // check if any values are empty using 'checkEmptyValues' class method
            const hasEmptyValues = this.checkEmptyValues();
            //if object returned includes 'errorMessage' key, return it
            if(hasEmptyValues.errorMessage) {
                return {
                    errorMessage: hasEmptyValues.errorMessage
                };
            }

            //if user entered 'contact_phone' & 'contact_email' keys, assign to variables
            const phoneNo = this.obj.contact_phone;
            const email = this.obj.contact_email;

            //if user entered 'contact_phone' & it doesn't match desired format, return an error
            if (phoneNo && !this.validPhoneNo(phoneNo)) {
                return {
                    errorMessage: `ERROR '${phoneNo}' is not a valid phone number format.`
                }
            }
            //if user entered 'contact_email' & it doesn't match desired format, return an error
            if (email && !this.validEmail(email)) {
                return {
                    errorMessage: `ERROR '${email}' is not a valid email format.`
                }
            }
            //passed all validation, return true
            return { 
                success: true,

            };
        }
        else { //did not specify 'create' or 'update'
            return {
              errorMessage: `Invalid CRUD type '${crudType}'. Must use 'create' or 'update'.`
            }
        }
    }
}

export default Warehouse;