import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PaymentFrequency, PropertyType, TransactionType } from 'src/app/shared/enums/property';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-edit',
  templateUrl: './properties-edit.component.html',
  styleUrls: ['./properties-edit.component.scss'],
})
export class PropertiesEditComponent implements OnInit {
  public propertyForm: UntypedFormGroup;
  public propertyTypes = [
    {
      label: 'residential',
      value: PropertyType.residential
    },
    {
      label: 'commercial',
      value: PropertyType.commercial
    },
    {
      label: 'industrial',
      value: PropertyType.industrial
    }, {
      label: 'land',
      value: PropertyType.land
    }
  ];
  public transactionType = [
    {
      label: 'For Sale',
      value: TransactionType.forSale
    },
    {
      label: 'For Rent',
      value: TransactionType.forRent
    }
  ];
  public rentPaymentFrequency = [
    {
      label: 'Yearly',
      value: PaymentFrequency.yearly
    },
    {
      label: 'Quarterly',
      value: PaymentFrequency.quarterly
    },
    {
      label: 'Monthly',
      value: PaymentFrequency.monthly
    },
    {
      label: 'Bi-Weekly',
      value: PaymentFrequency.biWeekly
    },
    {
      label: 'Weekly',
      value: PaymentFrequency.weekly
    },
    {
      label: 'Daily',
      value: PaymentFrequency.daily
    }
  ];
  public property: Property;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController
  ) {
    this.propertyForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      type: [PropertyType.residential],
      transactionType: [TransactionType.forSale],
      price: ['',],
      paymentFrequency: [PaymentFrequency.monthly],
      currency: ['', Validators.maxLength(3)],
      features: [''],
      lat: ['0', Validators.required],
      lng: ['0', Validators.required],
    });
  }

  ngOnInit() {
    this.propertiesService.property$.subscribe(property => {
      this.property = property;
      if (property) {
        const {
          name, address, description, type, price, paymentFrequency, currency, features, position, transactionType
        } = property;

        this.propertyForm.patchValue(
          {
            name,
            address,
            description,
            type,
            price,
            paymentFrequency,
            currency,
            features: features ? features.join(', ').trim() : '',
            transactionType,
            lat: position.lat,
            lng: position.lng
          }
        );
      }
    });
  }

  public async update(): Promise<void> {
    if (!this.propertyForm.valid) {
      return;
    }
    const {
      name,
      address,
      description,
      type,
      transactionType,
      updatedAt,
      price,
      paymentFrequency,
      currency,
      features,
      lat,
      lng,
    } = this.propertyForm.value;

    const editedProperty: Property = {
      property_id: this.property.property_id,
      name,
      address,
      description,
      type,
      transactionType,
      price,
      paymentFrequency,
      currency,
      updatedAt,
      features: features.split(',').filter((item: string) => item.trim() !== ''),
      position: { lat, lng },
      user_id: this.property.user_id
    };
    const updatedProperty = { ...this.property, ...editedProperty };
    const res = await this.propertiesService.updateProperty(updatedProperty);

    if (res) {
      const toast = await this.toastCtrl.create({
        message: res.message,
        duration: 3000,
        color: 'success'
      });
      await toast.present();
    }
    this.modalCtrl.dismiss();
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  public async openMap() {
    const modal = await this.modalCtrl.create({
      component: PropertiesCoordinatesComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const { lat, lng } = data;
      this.propertyForm.patchValue({ lat, lng });
    }
  }
}
