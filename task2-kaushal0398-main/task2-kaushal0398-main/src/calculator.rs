///-------------------------------------------------------------------------------
///
/// This is your calculator implementation task 
/// to practice enums, structs, and methods.
/// 
/// Complete the implementation of the Calculator struct and its methods.
/// 
/// The calculator should support basic arithmetic 
/// operations (addition, subtraction, multiplication)
/// with overflow protection and maintain a history 
/// of operations.
/// 
/// Tasks:
/// 1. Implement the OperationType enum methods
/// 2. Implement the Operation struct constructor
/// 3. Implement all Calculator methods
/// 
///-------------------------------------------------------------------------------

#[derive(Clone)]
pub enum OperationType {
    Addition,
    Subtraction,
    Multiplication,
}

impl OperationType {
    // Return the string representation of the operation sign
    pub fn get_sign(&self) -> &str {
        match self {
            OperationType::Addition => "+",
            OperationType::Subtraction => "-",
            OperationType::Multiplication => "*",
        }
    }

    // Perform the operation with overflow protection
    pub fn perform(&self, x: i64, y: i64) -> Option<i64> {
        match self {
            OperationType::Addition => x.checked_add(y),
            OperationType::Subtraction => x.checked_sub(y),
            OperationType::Multiplication => x.checked_mul(y),
        }
    }
}

#[derive(Clone)]
pub struct Operation {
    pub first_num: i64,
    pub second_num: i64,
    pub operation_type: OperationType,
}

impl Operation {
    // Create a new Operation with given parameters
    pub fn new(first_num: i64, second_num: i64, operation_type: OperationType) -> Self {
        Operation {
            first_num,
            second_num,
            operation_type,
        }
    }
}

pub struct Calculator {
    pub history: Vec<Operation>,
}

impl Calculator {
    // Create a new Calculator with empty history
    pub fn new() -> Self {
        Calculator { history: Vec::new() }
    }

    // Perform addition and store operation if successful
    pub fn addition(&mut self, x: i64, y: i64) -> Option<i64> {
        let op_type = OperationType::Addition;
        let result = op_type.perform(x, y)?;
        self.history.push(Operation::new(x, y, op_type));
        Some(result)
    }

    // Perform subtraction and store operation if successful
    pub fn subtraction(&mut self, x: i64, y: i64) -> Option<i64> {
        let op_type = OperationType::Subtraction;
        let result = op_type.perform(x, y)?;
        self.history.push(Operation::new(x, y, op_type));
        Some(result)
    }

    // Perform multiplication and store operation if successful
    pub fn multiplication(&mut self, x: i64, y: i64) -> Option<i64> {
        let op_type = OperationType::Multiplication;
        let result = op_type.perform(x, y)?;
        self.history.push(Operation::new(x, y, op_type));
        Some(result)
    }

    // Show all operations in formatted string
    pub fn show_history(&self) -> String {
        let mut output = String::new();
        for (i, op) in self.history.iter().enumerate() {
            if let Some(result) = op.operation_type.perform(op.first_num, op.second_num) {
                output.push_str(&format!(
                    "{}: {} {} {} = {}\n",
                    i,
                    op.first_num,
                    op.operation_type.get_sign(),
                    op.second_num,
                    result
                ));
            }
        }
        output
    }

    // Repeat an operation by index and add to history
    pub fn repeat(&mut self, operation_index: usize) -> Option<i64> {
        if let Some(op) = self.history.get(operation_index).cloned() {
            let result = op.operation_type.perform(op.first_num, op.second_num)?;
            self.history.push(op);
            Some(result)
        } else {
            None
        }
    }

    // Clear the history
    pub fn clear_history(&mut self) {
        self.history.clear();
    }
}

