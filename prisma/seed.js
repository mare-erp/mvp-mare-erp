"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var workspace, hashedPassword, user, clients, products, order1, order2, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Iniciando seed do banco de dados...');
                    return [4 /*yield*/, prisma.workspace.create({
                            data: {
                                name: 'Empresa Demo'
                            }
                        })];
                case 1:
                    workspace = _a.sent();
                    console.log('✅ Workspace criado:', workspace.name);
                    return [4 /*yield*/, bcryptjs_1.default.hash('123456', 12)];
                case 2:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                name: 'Administrador',
                                email: 'admin@teste.com',
                                password: hashedPassword
                            }
                        })];
                case 3:
                    user = _a.sent();
                    console.log('✅ Usuário criado:', user.email);
                    // Create workspace membership
                    return [4 /*yield*/, prisma.workspaceMember.create({
                            data: {
                                userId: user.id,
                                workspaceId: workspace.id,
                                role: 'ADMIN'
                            }
                        })];
                case 4:
                    // Create workspace membership
                    _a.sent();
                    console.log('✅ Membership criado');
                    return [4 /*yield*/, Promise.all([
                            prisma.client.create({
                                data: {
                                    name: 'João Silva',
                                    document: '12345678901',
                                    email: 'joao@email.com',
                                    phone: '(11) 99999-1111',
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.client.create({
                                data: {
                                    name: 'Maria Santos',
                                    document: '98765432100',
                                    email: 'maria@email.com',
                                    phone: '(11) 99999-2222',
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.client.create({
                                data: {
                                    name: 'Empresa ABC Ltda',
                                    document: '12345678000199',
                                    email: 'contato@empresaabc.com',
                                    phone: '(11) 3333-4444',
                                    workspaceId: workspace.id
                                }
                            })
                        ])];
                case 5:
                    clients = _a.sent();
                    console.log('✅ Clientes criados:', clients.length);
                    return [4 /*yield*/, Promise.all([
                            prisma.product.create({
                                data: {
                                    name: 'Produto A',
                                    sku: 'PROD-001',
                                    price: 99.90,
                                    costPrice: 50.00,
                                    quantity: 100,
                                    minStock: 10,
                                    isService: false,
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.product.create({
                                data: {
                                    name: 'Produto B',
                                    sku: 'PROD-002',
                                    price: 149.90,
                                    costPrice: 75.00,
                                    quantity: 50,
                                    minStock: 5,
                                    isService: false,
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.product.create({
                                data: {
                                    name: 'Consultoria',
                                    price: 200.00,
                                    quantity: 0,
                                    minStock: 0,
                                    isService: true,
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.product.create({
                                data: {
                                    name: 'Produto C - Estoque Baixo',
                                    sku: 'PROD-003',
                                    price: 79.90,
                                    costPrice: 40.00,
                                    quantity: 3,
                                    minStock: 10,
                                    isService: false,
                                    workspaceId: workspace.id
                                }
                            })
                        ])];
                case 6:
                    products = _a.sent();
                    console.log('✅ Produtos criados:', products.length);
                    return [4 /*yield*/, prisma.order.create({
                            data: {
                                clientId: clients[0].id,
                                totalAmount: 299.70,
                                status: 'SOLD',
                                workspaceId: workspace.id,
                                items: {
                                    create: [
                                        {
                                            productId: products[0].id,
                                            quantity: 2,
                                            unitPrice: 99.90
                                        },
                                        {
                                            productId: products[1].id,
                                            quantity: 1,
                                            unitPrice: 149.90
                                        }
                                    ]
                                }
                            }
                        })];
                case 7:
                    order1 = _a.sent();
                    return [4 /*yield*/, prisma.order.create({
                            data: {
                                clientId: clients[1].id,
                                totalAmount: 200.00,
                                status: 'BUDGET',
                                workspaceId: workspace.id,
                                items: {
                                    create: [
                                        {
                                            productId: products[2].id,
                                            quantity: 1,
                                            unitPrice: 200.00
                                        }
                                    ]
                                }
                            }
                        })];
                case 8:
                    order2 = _a.sent();
                    console.log('✅ Pedidos criados:', 2);
                    return [4 /*yield*/, Promise.all([
                            prisma.transaction.create({
                                data: {
                                    description: 'Venda para João Silva',
                                    amount: 299.70,
                                    type: 'INCOME',
                                    status: 'PAID',
                                    dueDate: new Date(),
                                    paidAt: new Date(),
                                    category: 'Vendas',
                                    orderId: order1.id,
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.transaction.create({
                                data: {
                                    description: 'Pagamento fornecedor',
                                    amount: 500.00,
                                    type: 'EXPENSE',
                                    status: 'PENDING',
                                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                                    category: 'Fornecedores',
                                    workspaceId: workspace.id
                                }
                            }),
                            prisma.transaction.create({
                                data: {
                                    description: 'Aluguel do escritório',
                                    amount: 1200.00,
                                    type: 'EXPENSE',
                                    status: 'PAID',
                                    dueDate: new Date(),
                                    paidAt: new Date(),
                                    category: 'Despesas Fixas',
                                    workspaceId: workspace.id
                                }
                            })
                        ])];
                case 9:
                    transactions = _a.sent();
                    console.log('✅ Transações criadas:', transactions.length);
                    console.log('🎉 Seed concluído com sucesso!');
                    console.log('📧 Email: admin@teste.com');
                    console.log('🔑 Senha: 123456');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
