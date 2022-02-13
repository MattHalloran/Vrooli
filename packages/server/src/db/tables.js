export const ASSOCIATION_TABLES = {
    ImageLabels: 'image_labels',
    CustomerRoles: 'customer_roles',
}

export const STANDARD_TABLES = {
    ContactInfo: 'contact_info',
    Email: 'email',
    Feedback: 'feedback',
    Image: 'image',
    ImageFile: 'image_file',
    Role: 'role',
    Task: 'queue_task',
    Customer: 'customer', // User is a reserved word in many databases, so we use customer instead
}

export const TABLES = {
    ...ASSOCIATION_TABLES,
    ...STANDARD_TABLES
}