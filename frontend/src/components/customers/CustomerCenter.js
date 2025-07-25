import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockTransactions } from "../../data/mockData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search, 
  Plus, 
  FileText, 
  DollarSign, 
  Receipt, 
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Filter
} from "lucide-react";

const CustomerCenter = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || customer.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const customerTransactions = mockTransactions.filter(
    transaction => transaction.customer === selectedCustomer?.name
  );

  const handleNewCustomer = () => {
    navigate("/customers/new");
  };

  const handleNewTransaction = (type) => {
    const paths = {
      invoice: "/customers/invoice/new",
      payment: "/customers/payments/new",
      receipt: "/customers/sales-receipt/new",
      statement: "/customers/statement/new"
    };
    navigate(paths[type]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Center</h1>
          <p className="text-gray-600">Manage your customers and track receivables</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleNewCustomer} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleNewTransaction('invoice')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleNewTransaction('payment')}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Receive Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customers</span>
              <Badge variant="secondary">{filteredCustomers.length}</Badge>
            </CardTitle>
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCustomer?.id === customer.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${customer.balance.toFixed(2)}</p>
                      <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer Details</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Customer Info</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="statements">Statements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                        <p className="text-gray-600">{selectedCustomer.type}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedCustomer.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Account Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Current Balance:</span>
                            <span className="font-semibold">${selectedCustomer.balance.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Terms:</span>
                            <span>{selectedCustomer.terms}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge variant={selectedCustomer.status === 'Active' ? 'default' : 'secondary'}>
                              {selectedCustomer.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Recent Transactions</h4>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  {customerTransactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Number</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>{transaction.number}</TableCell>
                            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={transaction.status === 'Paid' ? 'default' : 'secondary'}>
                                {transaction.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No transactions found for this customer</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="statements" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Customer Statements</h4>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Create Statement
                    </Button>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No statements available</p>
                    <p className="text-sm">Create a statement to get started</p>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select a customer to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerCenter;