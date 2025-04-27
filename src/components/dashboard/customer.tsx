import React from 'react'
import { TabsContent } from '../ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const Customer = () => {
  return (
    <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8 text-gray-500">
                    This section is under development.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  )
}

export default Customer
