import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
const PORT = process.env.PORT || 4404;

const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'Car Dealership API',
        version: '1.0.0',
        description: 'API documentation for the Car Dealership project',
    },
    servers: [
        {
            url: `http://localhost:${PORT}`, // Ensure PORT is correctly defined
            description: 'Development server',
        },
    ],
    apis: ['./src/routes/*.ts'], // Path to route files for documentation,
    paths: {
        '/api/v1/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                consumes: ['application/json'],
                parameters: [
                    {
                        in: 'body',
                        name: 'user',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                username: { type: 'string', example: 'john_doe' },
                                email: { type: 'string', example: 'username@email.com' },
                                password: { type: 'string', example: 'password123' },
                                role: {
                                    type: 'string',
                                    enum: ['customer', 'manager', 'admin'],
                                    default: 'customer',
                                    example: 'customer'
                                }
                            },
                            required: ['username', 'email', 'password']
                        }
                    }
                ],
                responses: {
                    201: {
                        description: 'User created successfully',
                        schema: { $ref: '#/definitions/User' }
                    },
                    400: {
                        description: 'Validation error',
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                message: {
                                    type: 'string',
                                    example: 'Validation error: [{"path":"username","message":"Required"}]'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Internal server error',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Internal server error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login a user',
                parameters: [
                    {
                        in: 'body',
                        name: 'credentials',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', example: 'username@gmail.com' },
                                password: { type: 'string', example: 'password123' }
                            },
                            required: ['email', 'password']
                        },
                    }
                ],
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Login successful'
                                        },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: {
                                                    type: 'string',
                                                    description: 'User ID',
                                                    example: '12345'
                                                },
                                                username: {
                                                    type: 'string',
                                                    description: 'User name',
                                                    example: 'john_doe'
                                                },
                                                email: {
                                                    type: 'string',
                                                    description: 'User email',
                                                    example: 'username@gmail.com'
                                                },
                                                role: {
                                                    type: 'string',
                                                    description: 'User role',
                                                    example: 'customer'
                                                },
                                            },
                                        },
                                        token: {
                                            type: 'string',
                                            description: 'Authentication token',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized, invalid credentials',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Invalid email or password'
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/cars': {
            post: {
                tags: ['Cars'],
                summary: 'Create a new car (manager or admin only)',
                parameters: [
                    {
                        in: 'body',
                        name: 'car',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                brand: { type: 'string', example: 'Toyota' },
                                carModel: { type: 'string', example: 'Camry' },
                                year: { type: 'integer', example: 2022 },
                                price: { type: 'number', example: 30000 },
                                color: { type: 'string', example: 'Blue' },
                                mileage: { type: 'number', example: 15000 },
                                category: { type: 'string', example: '64a8b123cdef4567890abc99' },
                                features: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['Air Conditioning', 'Navigation System']
                                },
                                availability: { type: 'boolean', example: true }
                            },
                            required: ['brand', 'carModel', 'year', 'price', 'category']
                        },
                    },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    '201': {
                        description: 'Car created successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Car' }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'object',
                                            additionalProperties: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                },
                            },
                        },
                    },
                },
            },
            get: {
                tags: ['Cars'],
                summary: 'Get all cars',
                parameters: [
                    { in: 'query', name: 'brand', schema: { type: 'string' }, description: 'Filter by car brand' },
                    { in: 'query', name: 'carmodel', schema: { type: 'string' }, description: 'Filter by car model' },
                    { in: 'query', name: 'minPrice', schema: { type: 'number' }, description: 'Minimum price' },
                    { in: 'query', name: 'maxPrice', schema: { type: 'number' }, description: 'Maximum price' },
                    { in: 'query', name: 'minYear', schema: { type: 'number' }, description: 'Minimum year' },
                    { in: 'query', name: 'maxYear', schema: { type: 'number' }, description: 'Maximum year' },
                    { in: 'query', name: 'color', schema: { type: 'string' }, description: 'Filter by car color' },
                    { in: 'query', name: 'minMileage', schema: { type: 'number' }, description: 'Minimum mileage' },
                    { in: 'query', name: 'maxMileage', schema: { type: 'number' }, description: 'Maximum mileage' },
                    { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category' },
                    { in: 'query', name: 'availability', schema: { type: 'boolean' }, description: 'Filter by availability' },
                    { in: 'query', name: 'page', schema: { type: 'number', default: 1 }, description: 'Page number for pagination' },
                    { in: 'query', name: 'limit', schema: { type: 'number', default: 10 }, description: 'Number of items per page' },
                    { in: 'query', name: 'sort', schema: { type: 'string' }, description: 'Sort by fields (comma-separated, use - for descending)' },
                    { in: 'query', name: 'fields', schema: { type: 'string' }, description: 'Comma-separated list of fields to include in the response' },
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of cars',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Cars retrieved successfully' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Car' }
                                        },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                total: { type: 'integer', example: 100 },
                                                page: { type: 'integer', example: 1 },
                                                pages: { type: 'integer', example: 10 },
                                                limit: { type: 'integer', example: 10 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'error' },
                                        message: { type: 'string', example: 'Validation failed' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'Expected number, received string' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/cars/{id}': {
            get: {
                tags: ['Cars'],
                summary: 'Get a car by ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Car ID'
                    }
                ],
                security: [{ JWTAuth: [] }],
                responses: {
                    '200': {
                        description: 'Car details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Car' }
                            }
                        }
                    },
                    '404': {
                        description: 'Car not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Car not found' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ['Cars'],
                summary: 'Update a car by ID (manager or admin only)',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Car ID'
                    },
                    {
                        in: 'body',
                        name: 'car',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                brand: { type: 'string', example: 'Toyota' },
                                carModel: { type: 'string', example: 'Camry' },
                                year: { type: 'integer', example: 2022 },
                                price: { type: 'number', example: 30000 },
                                color: { type: 'string', example: 'Blue' },
                                mileage: { type: 'number', example: 15000 },
                                category: { type: 'string', example: '64a8b123cdef4567890abc99' },
                                features: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['Air Conditioning', 'Navigation System']
                                },
                                availability: { type: 'boolean', example: true }
                            }
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Car updated successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Car' }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'object',
                                            additionalProperties: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Car not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Car not found' }
                                    }
                                }
                            }
                        }
                    }
                },
                security: [{ JWTAuth: [] }]
            },
            delete: {
                tags: ['Cars'],
                summary: 'Delete a car by ID (admin only)',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Car ID'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Car deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Car deleted successfully' }
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Car not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Car not found' }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                },
                security: [{ JWTAuth: [] }]
            }
        },
        '/api/v1/categories': {
            get: {
                tags: ['Categories'],
                summary: 'Get all categories',
                parameters: [
                    {
                        in: 'query',
                        name: 'page',
                        schema: { type: 'integer', example: 1 },
                        description: 'Page number for pagination'
                    },
                    {
                        in: 'query',
                        name: 'limit',
                        schema: { type: 'integer', example: 10 },
                        description: 'Number of items per page'
                    },
                    {
                        in: 'query',
                        name: 'sort',
                        schema: { type: 'string', example: 'name,-createdAt' },
                        description: 'Sort by fields (comma-separated, use - for descending)'
                    },
                    {
                        in: 'query',
                        name: 'fields',
                        schema: { type: 'string', example: 'name,description' },
                        description: 'Select specific fields (comma-separated)'
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of categories',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Categories retrieved successfully' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Category' }
                                        },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                total: { type: 'integer', example: 100 },
                                                page: { type: 'integer', example: 1 },
                                                pages: { type: 'integer', example: 10 },
                                                limit: { type: 'integer', example: 10 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Categories'],
                summary: 'Create a new category (manager or admin only)',
                parameters: [
                    {
                        in: 'body',
                        name: 'category',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'SUV' },
                                description: { type: 'string', example: 'Spacious utility vehicle' }
                            },
                            required: ['name']
                        },
                    },
                ],
                responses: {
                    '201': {
                        description: 'Category created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Category'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'object',
                                            additionalProperties: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                },
                security: [{ JWTAuth: [] }]
            }
        },
        '/api/v1/categories/{id}': {
            get: {
                tags: ['Categories'],
                summary: 'Get a category by ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Category ID'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Category retrieved successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Category' }
                            }
                        }
                    },
                    '404': {
                        description: 'Category not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Category not found' }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ['Categories'],
                summary: 'Update a category by ID (manager or admin only)',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Category ID'
                    },
                    {
                        in: 'body',
                        name: 'category',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                name: { type: 'string', example: 'SUV' },
                                description: { type: 'string', example: 'Spacious utility vehicle' }
                            },
                            required: ['name']
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Category updated successfully',
                        schema: { $ref: '#/components/schemas/Category' }
                    },
                    '400': {
                        description: 'Validation error',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Validation error' },
                                errors: {
                                    type: 'object',
                                    additionalProperties: { type: 'string' }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Category not found',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Category not found' }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Internal server error' }
                            }
                        }
                    }
                },
                security: [{ JWTAuth: [] }]
            },
            delete: {
                tags: ['Categories'],
                summary: 'Delete a category by ID (admin only)',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        type: 'string',
                        description: 'Category ID'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Category deleted successfully',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Category deleted successfully' }
                            }
                        }
                    },
                    '404': {
                        description: 'Category not found',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Category not found' }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Internal server error' }
                            }
                        }
                    }
                },
                security: [{ JWTAuth: [] }]
            },
        },
        '/api/v1/customers': {
            post: {
                tags: ['Customers'],
                summary: 'Create a new customer profile (authenticated users only)',
                parameters: [
                    {
                        in: 'body',
                        name: 'customer',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: {
                                    type: 'string',
                                    example: 'John'
                                },
                                lastName: {
                                    type: 'string',
                                    example: 'Doe'
                                },
                                phone: {
                                    type: 'string',
                                    example: '+2348012345678'
                                },
                                address: {
                                    type: 'object',
                                    properties: {
                                        street: { type: 'string', example: '123 Main St' },
                                        city: { type: 'string', example: 'Lagos' },
                                        state: { type: 'string', example: 'Lagos State' },
                                        zip: { type: 'string', example: '100001' }
                                    }
                                },
                                favoriteBrands: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['Toyota', 'Honda']
                                }
                            },
                            required: ['firstName', 'lastName']
                        }
                    }
                ],
                responses: {
                    '201': {
                        description: 'Customer profile created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Customer profile created successfully' },
                                        data: {
                                            $ref: '#/components/schemas/Customer'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'error' },
                                        message: { type: 'string', example: 'Validation failed' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'firstName must be at least 2 characters' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User token required',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Unauthorized' }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                },
                security: [{ JWTAuth: [] }],
            },
            get: {
                tags: ['Customers'],
                summary: 'Get all customers',
                parameters: [
                    { in: 'query', name: 'firstName', schema: { type: 'string' }, description: 'Filter by first name' },
                    { in: 'query', name: 'lastName', schema: { type: 'string' }, description: 'Filter by last name' },
                    { in: 'query', name: 'phone', schema: { type: 'string' }, description: 'Filter by phone number' },
                    { in: 'query', name: 'address.street', schema: { type: 'string' }, description: 'Filter by street' },
                    { in: 'query', name: 'address.city', schema: { type: 'string' }, description: 'Filter by city' },
                    { in: 'query', name: 'address.state', schema: { type: 'string' }, description: 'Filter by state' },
                    { in: 'query', name: 'address.zip', schema: { type: 'string' }, description: 'Filter by zip code' },
                    { in: 'query', name: 'favoriteBrands', schema: { type: 'array', items: { type: 'string' } }, description: 'Filter by favorite brands' },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number for pagination' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Number of items per page' },
                    { in: 'query', name: 'sort', schema: { type: 'string' }, description: 'Sort by fields (comma-separated, use - for descending)' },
                ],
                responses: {
                    '200': {
                        description: 'List of customers',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Customers retrieved successfully' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Customer' },
                                        },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                total: { type: 'integer', example: 100 },
                                                page: { type: 'integer', example: 1 },
                                                pages: { type: 'integer', example: 10 },
                                                limit: { type: 'integer', example: 10 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'error' },
                                        message: { type: 'string', example: 'Validation failed' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'Invalid query parameter' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
                security: [{ JWTAuth: [] }],
            },
        },
        '/api/v1/customers/{id}': {
            get: {
                tags: ['Customers'],
                summary: 'Get a customer by ID',
                security: [{ JWTAuth: [] }], // Add security definition
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Customer ID' },
                ],
                responses: {
                    '200': {
                        description: 'Customer details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Customer' },
                            },
                        },
                    },
                    '404': {
                        description: 'Customer not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Customer not found' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ['Customers'],
                summary: 'Update a customer by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string'
                        },
                        description: 'Customer ID'
                    },
                    {
                        in: 'body',
                        name: 'customer',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: { type: 'string', example: 'John' },
                                lastName: { type: 'string', example: 'Doe' },
                                phone: { type: 'string', example: '+2348100000000' },
                                address: {
                                    type: 'object',
                                    properties: {
                                        street: { type: 'string', example: '123 Main St' },
                                        city: { type: 'string', example: 'Lagos' },
                                        state: { type: 'string', example: 'Lagos' },
                                        zip: { type: 'string', example: '100001' }
                                    }
                                },
                                favoriteBrands: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    example: ['Toyota', 'BMW']
                                }
                            }
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Customer updated successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Customer' }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'Invalid input' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Customer not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Customer not found' }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Customers'],
                summary: 'Delete a customer by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Customer ID'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Customer deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Customer deleted successfully' },
                                        data: {
                                            type: 'object',
                                            description: 'Deleted customer details',
                                            example: {
                                                _id: '64f1e67c9a1e0e001f28aa12',
                                                firstName: 'John',
                                                lastName: 'Doe',
                                                phone: '+2348100000000'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Customer not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Customer not found' }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        '/api/v1/managers': {
            get: {
                tags: ['Managers'],
                summary: 'Get all managers',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number for pagination' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Number of items per page' },
                    { in: 'query', name: 'sort', schema: { type: 'string' }, description: 'Sort by fields (comma-separated, use - for descending)' },
                ],
                responses: {
                    '200': {
                        description: 'List of managers',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Manager' },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized - User token required',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Unauthorized' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Managers'],
                summary: 'Create a new manager profile (admin only)',
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        in: 'body',
                        name: 'manager',
                        required: true,
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: { type: 'string', example: 'John' },
                                lastName: { type: 'string', example: 'Doe' },
                                phone: { type: 'string', example: '+2348012345678' },
                                department: { type: 'string', example: 'Sales' },
                                hireDate: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
                            },
                            required: ['firstName', 'lastName', 'phone']
                        }
                    }
                ],
                responses: {
                    '201': {
                        description: 'Manager profile created successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Manager' },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'firstName must be at least 2 characters' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - Admin token required',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Unauthorized' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/managers/{id}': {
            get: {
                tags: ['Managers'],
                summary: 'Get a manager by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Manager ID' },
                ],
                responses: {
                    '200': {
                        description: 'Manager details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Manager' },
                            },
                        },
                    },
                    '404': {
                        description: 'Manager not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Manager not found' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    }
                }
            },
            put: {
                tags: ['Managers'],
                summary: 'Update a manager by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Manager ID'
                    },
                    {
                        in: 'body',
                        name: 'manager',
                        required: true,
                        description: 'Manager details to update all optional',
                        schema: {
                            type: 'object',
                            properties: {
                                firstName: { type: 'string', example: 'John' },
                                lastName: { type: 'string', example: 'Doe' },
                                phone: { type: 'string', example: '+2348012345678' },
                                department: { type: 'string', example: 'Sales' },
                                hireDate: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' }
                            },
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Manager updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Manager updated successfully' },
                                        data: { $ref: '#/components/schemas/Manager' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'First name must be at least 2 characters' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'Manager not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Manager not found' }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                },
            },
            delete: {
                tags: ['Managers'],
                summary: 'Delete a manager by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Manager ID' },
                ],
                responses: {
                    '200': {
                        description: 'Manager deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Manager deleted successfully' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Manager not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Manager not found' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/orders': {
            get: {
                tags: ['Orders'],
                summary: 'Get all orders',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'query', name: 'customer', schema: { type: 'string' }, description: 'Filter by customer ID' },
                    { in: 'query', name: 'car', schema: { type: 'string' }, description: 'Filter by car ID' },
                    { in: 'query', name: 'manager', schema: { type: 'string' }, description: 'Filter by manager ID' },
                    { in: 'query', name: 'status', schema: { type: 'string', enum: ['pending', 'completed', 'cancelled'] }, description: 'Filter by order status' },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number for pagination' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Number of items per page' },
                    { in: 'query', name: 'sort', schema: { type: 'string' }, description: 'Sort by fields (comma-separated, use - for descending)' },
                ],
                responses: {
                    '200': {
                        description: 'List of orders',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        message: { type: 'string', example: 'Orders retrieved successfully' },
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Order' },
                                        },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                total: { type: 'integer', example: 100 },
                                                page: { type: 'integer', example: 1 },
                                                pages: { type: 'integer', example: 10 },
                                                limit: { type: 'integer', example: 10 },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'Invalid query parameter' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Orders'],
                summary: 'Create a new order',
                security: [{ JWTAuth: [] }],
                parameters: [
                    {
                        in: 'body',
                        name: 'order',
                        required: true,
                        description: 'Order details to create',
                        schema: {
                            type: 'object',
                            properties: {
                                car: { type: 'string', example: '64a8b123cdef4567890abc99' },
                                manager: { type: 'string', example: '64a8b123cdef4567890abc01' },
                                price: { type: 'number', example: 23000 },
                                paymentMethod: { type: 'string', enum: ['cash', 'credit', 'finance'], example: 'cash' }
                            },
                            required: ['car', 'price', 'paymentMethod']
                        }
                    }
                ],
                responses: {
                    '201': {
                        description: 'Order created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Order created successfully' },
                                        data: { $ref: '#/components/schemas/Order' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'Invalid input' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        '/api/v1/orders/{id}': {
            get: {
                tags: ['Orders'],
                summary: 'Get an order by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Order ID' },
                ],
                responses: {
                    '200': {
                        description: 'Order details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Order' },
                            },
                        },
                    },
                    '404': {
                        description: 'Order not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Order not found' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ['Orders'],
                summary: 'Update an order by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Order ID' },
                    {
                        in: 'body',
                        name: 'order',
                        description: 'Order details to update optional fields',
                        schema: {
                            type: 'object',
                            properties: {
                                customer: { type: 'string', example: '64a8b123cdef4567890abcde' },
                                car: { type: 'string', example: '64a8b123cdef4567890abc99' },
                                manager: { type: 'string', example: '64a8b123cdef4567890abc01' },
                                price: { type: 'number', example: 23000 },
                                paymentMethod: { type: 'string', enum: ['cash', 'credit', 'finance'], example: 'credit' },
                                status: { type: 'string', enum: ['pending', 'completed', 'cancelled'], example: 'pending' },
                            },
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Order updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Order updated successfully' },
                                        data: { $ref: '#/components/schemas/Order' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Validation error' },
                                        errors: {
                                            type: 'array',
                                            items: { type: 'string', example: 'Invalid input' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Order not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Order not found' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ['Orders'],
                summary: 'Delete an order by ID',
                security: [{ JWTAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Order ID' },
                ],
                responses: {
                    '200': {
                        description: 'Order deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Order deleted successfully' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Order not found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Order not found' },
                                    },
                                },
                            },
                        },
                    },
                    '500': {
                        description: 'Internal server error',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Internal server error' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    securityDefinitions: {
        JWTAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    components: {
        schemas: {
            Car: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64a8b123cdef4567890abcde' },
                    brand: { type: 'string', example: 'Toyota' },
                    carModel: { type: 'string', example: 'Corolla' },
                    year: { type: 'integer', example: 2021 },
                    price: { type: 'number', example: 25000 },
                    color: { type: 'string', example: 'Red' },
                    mileage: { type: 'number', example: 12000 },
                    category: { type: 'string', example: '64a8b123cdef4567890abc99' },
                    features: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Bluetooth', 'Backup Camera']
                    },
                    availability: { type: 'boolean', example: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer', example: 0 }
                },
                required: ['brand', 'carModel', 'year', 'price', 'category']
            },
            Category: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64a8b123cdef4567890abc99' },
                    name: { type: 'string', example: 'SUV' },
                    description: { type: 'string', nullable: true, example: 'Spacious utility vehicle' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer', example: 0 }
                },
                required: ['name']
            },
            Customer: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64a8b123cdef4567890abccc' },
                    user: { type: 'string', example: '64a8b123cdef4567890ab001' },
                    firstName: { type: 'string', example: 'Jane' },
                    lastName: { type: 'string', example: 'Doe' },
                    phone: { type: 'string', example: '555-1234' },
                    address: {
                        type: 'object',
                        properties: {
                            street: { type: 'string', example: '123 Main St' },
                            city: { type: 'string', example: 'Springfield' },
                            state: { type: 'string', example: 'IL' },
                            zip: { type: 'string', example: '62704' }
                        }
                    },
                    favoriteBrands: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Toyota', 'Honda']
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer', example: 0 }
                },
                required: ['user', 'firstName', 'lastName']
            },
            Manager: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    user: { type: 'string' },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Smith' },
                    phone: { type: 'string', example: '555-6789' },
                    department: { type: 'string', example: 'Sales' },
                    hireDate: { type: 'string', format: 'date-time' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer', example: 0 }
                },
                required: ['user', 'firstName', 'lastName', 'phone']
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    customer: { type: 'string' },
                    car: { type: 'string' },
                    manager: { type: 'string', nullable: true },
                    price: { type: 'number', example: 23000 },
                    paymentMethod: {
                        type: 'string',
                        enum: ['cash', 'credit', 'finance'],
                        example: 'credit'
                    },
                    status: {
                        type: 'string',
                        enum: ['pending', 'completed', 'cancelled'],
                        example: 'pending'
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer', example: 0 }
                },
                required: ['customer', 'car', 'price', 'paymentMethod']
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    username: { type: 'string', example: 'johndoe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                    password: { type: 'string', example: 'hashedpassword123' },
                    role: {
                        type: 'string',
                        enum: ['customer', 'manager', 'admin'],
                        example: 'customer'
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer', example: 0 }
                },
                required: ['username', 'email', 'password']
            }
        },
    },

    tags: [
        { name: 'Auth', description: 'Authentication and authorization endpoints' },
        { name: 'Cars', description: 'Car management endpoints' },
        { name: 'Categories', description: 'Category management endpoints' },
        { name: 'Customers', description: 'Customer management endpoints' },
        { name: 'Managers', description: 'Manager management endpoints' },
        { name: 'Orders', description: 'Order management endpoints' },
    ]
}

const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, '../routes/*.ts')], // Ensures correct path resolution
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;