from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *
# Create your views here.

#why CSRF exempt? Because:
# React frontend is separate from Django backend
# Django expects CSRF token normally
# For easier API testing, CSRF is disabled
#Upcoming feature is to enable this with either JWT tokens, SessionAuth or ProperCSRF handling

#Signup API
@csrf_exempt
def signup(request):
    if(request.method)=="POST":
        data=json.loads(request.body)  #convert JSON response from frontend to python dictionary in backend.
        fullName=data.get('FullName')
        email=data.get('Email')
        password=data.get('Password')

        if UserDetail.objects.filter(Email=email).exists():
            return JsonResponse({'message':'Email already exist'},status=400)
        UserDetail.objects.create(FullName=fullName,Email=email,Password=password)
        return JsonResponse({'message':'User registered successfully'},status=201)


#Login API
@csrf_exempt
def login(request):
    if(request.method)=="POST":
        data=json.loads(request.body)
        email=data.get('Email')
        password=data.get('Password')

        try:
            user = UserDetail.objects.get(Email=email,Password=password)
            return JsonResponse({'message':'User found','userId':user.id,'username':user.FullName},status=200)
        except:
            return JsonResponse({'message':'User not found'},status=400)


#Expense API
@csrf_exempt
def add_expense(request):
    if(request.method)=="POST":
        data=json.loads(request.body)
        user_Id=data.get('UserId')
        expenseitem=data.get('ExpenseItem')
        expensedate=data.get('ExpenseDate')
        expensecost=data.get('ExpenseCost')

        user = UserDetail.objects.get(id=user_Id)
        try:
            Expense.objects.create(UserId=user, ExpenseDate=expensedate, ExpenseCost= expensecost, ExpenseItem=expenseitem)
            return JsonResponse({'message':'Expense added successfully'},status=201)
        except Exception as e:
            return JsonResponse({'message':'Expense not created, Something wrong','error':str(e)},status=400)


#Expense-Manage API
@csrf_exempt
def manage_expense(request,user_id):
    if(request.method)=="GET":
        expenses=Expense.objects.filter(UserId=user_id) # the data we recieve here will be the query set and we need to convert this into the JSON
        expense_list= list(expenses.values())  # here we will get multiple dictionary so need to convert this into the list
        return JsonResponse(expense_list,safe=False) # here we are using the safe because we are not sending the dictionary like above, we are sending the list in the response
       

#Update Expense API
@csrf_exempt
def update_expense(request,expense_id):
    if(request.method)=="PUT":
        data=json.loads(request.body)

        try:
            expense=Expense.objects.get(id=expense_id)
            expense.ExpenseDate= data.get('ExpenseDate',expense.ExpenseDate)
            expense.ExpenseItem= data.get('ExpenseItem',expense.ExpenseItem)
            expense.ExpenseCost= data.get('ExpenseCost',expense.ExpenseCost)
            expense.save()
            return JsonResponse({'message':'Expense updated successfully'},status=200)
        except Exception as e:
            return JsonResponse({'message':'Expense not updated, Something wrong','error':str(e)},status=400)

    

#delete Expense API
@csrf_exempt
def delete_expense(request,expense_id):
    if(request.method)=="DELETE":

        try:
            expense=Expense.objects.get(id=expense_id)
            expense.delete()
            return JsonResponse({'message':'Expense deleted successfully'},status=200)
        except Exception as e:
            return JsonResponse({'message':'Expense not deleted, Something wrong','error':str(e)},status=400)


from django.db.models import Sum
#Search Expense API
@csrf_exempt
def search_expense(request,user_id):
    if(request.method)=="GET":
        from_date=request.GET.get('from') #reads URL query parameters
        to_date=request.GET.get('to')
        expenses=Expense.objects.filter(UserId=user_id,ExpenseDate__range=[from_date,to_date])
        expense_list= list(expenses.values())
        agg= expenses.aggregate(Sum('ExpenseCost')) # this aggregate will return in this format {'ExpenseCost__Sum':3500 }
        total= agg['ExpenseCost__sum'] or 0
        return JsonResponse({'expenses':expense_list,'total':total})
    

#Change Password API
@csrf_exempt
def change_password(request,user_id):
    if(request.method)=="POST":
        data=json.loads(request.body)
        oldPassword=data.get('oldPassword')
        newPassword=data.get('newPassword')

        try:
            user = UserDetail.objects.get(id=user_id)
            if user.Password!=oldPassword:
                return JsonResponse({'message':'Your old password didnt match, try again..'},status=400)
            user.Password=newPassword
            user.save()
            return JsonResponse({'message':'password changed successfully'},status=200)
        except:
            return JsonResponse({'message':'Password did not change'},status=404) 




from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from django.http import HttpResponse
from .models import Expense
from datetime import datetime

def expense_pdf(request, user_id):
    from_date = request.GET.get("from")
    to_date = request.GET.get("to")

    expenses = Expense.objects.filter(
        UserId=user_id,
        ExpenseDate__range=[from_date, to_date]
    )

    # Create PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="expense_report_{from_date}_to_{to_date}.pdf"' #forces to download instead opening in browser

    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "Expense Report")

    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"From: {from_date}")
    p.drawString(250, height - 80, f"To: {to_date}")

    y = height - 120
    total = 0

    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "Date")
    p.drawString(150, y, "Item")
    p.drawString(350, y, "Cost (Rs)")
    y -= 20

    p.setFont("Helvetica", 11)

    for exp in expenses:
        if y < 50:
            p.showPage()
            y = height - 50

        p.drawString(50, y, str(exp.ExpenseDate))
        p.drawString(150, y, exp.ExpenseItem)
        p.drawString(350, y, str(exp.ExpenseCost))
        total += float( exp.ExpenseCost)
        y -= 20

    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y - 20, f"Grand Total: Rs {total}")

    p.showPage()
    p.save()
    return response
   