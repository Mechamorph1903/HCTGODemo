export default function InfoPage(){


    return(
        <div className="p-6">
            <div className="flex gap-5 flex-col">
                <h1 className="text-2xl font-bold">Information</h1>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h2 className="text-xl font-semibold mb-4">Fares</h2>
                    <p>Most rides are 50¢. Reduced and free fares are available for eligible riders with ID.</p>

                    <div>
                        <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0">
                        <div>
                            <p className="font-medium text-sm">Standard Fare</p>
                            <p className="text-xs text-slate-400">All riders unless eligible for reduced or free fare</p>
                        </div>
                        <span className="font-bold text-lg">$0.50</span>
                        </div>
                        <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0">
                            <div>
                                <p className="font-medium text-sm">Reduced Fare</p>
                                <p className="text-xs text-slate-400">Children (ages 5—highschool) • Seniors (62+) • Disabled with ID • HCT ID and Medicare</p>
                            </div>
                            <span className="font-bold text-lg">$0.25</span>
                        </div>
                        <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0">
                            <div>
                                <p className="font-medium text-sm">Free Fare</p>
                                <p className="text-xs text-slate-400">Southern Miss. students and City of Hattiesburg Employees</p>
                            </div>
                            <span className="font-bold text-lg">$0.00</span>
                        </div>                     
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                        <p>Pay as you board bus.</p><br />
                        <p>Exact change only; Drivers do not possess change.</p><br />
                        <p>If using reduced or free fare, please have ID in hand before boarding bus to reduce delay (students to show student ID)</p>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h2 className="text-xl font-semibold mb-4">Runtime</h2>
                    <p>
                        <strong>Hub City Transit</strong> buses run from <strong>6:00 AM until 6:30 PM, Monday through Friday</strong>. 
                        <span className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 inline-block">Buses do not run on the following holidays: <strong>New Year's Day, Martin Luther King Jr. Day, Good Friday, Memorial Day, Fourth July, 
                        Labor Day, Veteran's Day, Thanskgiving Day and Christmas Day.</strong></span>
                    </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h2 className="text-xl font-semibold mb-4">Paratransit</h2>
                    <p>Shared-ride, door-to-door service for riders who cannot use fixed-route buses because of a disability. Operates within ¾ mile of HCT routes in accordance with the ADA.</p>
                    <a href="https://hubcitytransit.com/paratransit/" className="inline-flex items-center justify-center h-10 w-40 border border-blue-500 rounded-lg mt-4 text-blue-500 text-sm font-medium ">More Information</a>
                </div>
            </div>
        </div>
    )
}